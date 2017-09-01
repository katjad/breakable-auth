// learned this pattern from Stephen Grider Udemy Tut 
// on Authentication with React

module.exports = function(app){  

    const passport = require('passport')
    const GitHubStrategy = require('passport-github').Strategy;
    const jwt = require('jwt-simple');
    const JwtStrategy = require('passport-jwt').Strategy;
    const ExtractJwt = require('passport-jwt').ExtractJwt;
    // const session = require('express-session');
    const config = require('../appConfig');

    const User = require('../models/users');
    const items = require('../routes/items')

    app.use(passport.initialize());
    // JWT
    function tokenForUser(github_id) {
      const timestamp = new Date().getTime()
      return jwt.encode({ sub: github_id, iat: timestamp }, config.jwt_secret)
    }
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: config.jwt_secret
    }
    const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
      // see if user ID in payload exists in database

      User.sync().then(() => {
        return User.findOne({ where: { github_id: payload.sub } })
        .then(user => { 
          if(user) {
            console.log("hooray")
            done(null, user) 
          } else {
            done(null, false)
          }
        })
        .catch((err) => {done(err, false)})
      })
    })
    passport.use(jwtLogin)



    passport.use(new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID || process.env.CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET || process.env.CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },
      function(accessToken, refreshToken, user, cb) {
          return cb(null, user);
      }
    ));

    // setting the token in the header if we have been redirected to profile after Github auth
    // unfortunately can't use this as to get the token from the header have to do a new 
    // request and then the token changes!
    setTokenInHeader = (req, res, next) => {
      const arr =  req.url.split('/')
      if(arr[1] == 'profile' && arr[2]){
        const token = tokenForUser(arr[2])
        console.log(token)
        res.setHeader('jwt', token)
        console.log("again", token)
      }
      next()      
    }
    // app.use(setTokenInHeader)

    //OAuth authentication route
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', 
      passport.authenticate('github', { session: false, failureRedirect: '/' }), 
      function(req, res) {
        const user = req.user;
        User.sync().then(() => {
          return User.findOrCreate(
          { where: {
              github_id: user.id
            }, defaults: {
              name: user.displayName, 
              username: user.username, 
              email: user._json.email
            }
          }).spread((user, created) => {
            console.log(user.get({
              plain: true
            }))
            res.redirect('/profile/'+user.github_id)
          })       
      })
    })


    app.get('/profile/:git_id', (req, res, next) => {
        res.render('profile', {token: tokenForUser(req.params.git_id)})
        //res.json({token: tokenForUser(req.params.git_id)})
    })
    
    const requireAuth = passport.authenticate('jwt', {session: false}) 

    // get all Items or one item
    app.get('/item*', requireAuth,  items)  // yay, this works!!
 
}
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
      console.log("payload", payload)
      console.log("sub", payload.sub)
      User.sync().then(() => {
        return User.findOne({ where: { github_id: payload.sub } })
        .then(user => { 
          if(user) {
             done(null, user) 
          } else {
            done(null, false)
          }
        })
        .catch((err) => {done(err, false)})
      })
    })
    passport.use(jwtLogin)


    // Github
    passport.use(new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID || process.env.CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET || process.env.CLIENT_SECRET,
        callbackURL: '/profile',
      },
      function(accessToken, refreshToken, user, cb) {
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
            return cb(null, user);
          })       
        })         
      }
    ));


    //OAuth authentication route
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/profile', 
      passport.authenticate('github', { session: false, failureRedirect: '/' }), 
      function(req, res) {
        const user = req.user;        
        //res.redirect('/profile/'+user.github_id)
        const token = tokenForUser(user.github_id)
        res.render('profile', {user: user, token: token})
    })

    const requireAuth = passport.authenticate('jwt', {session: false}) 

    // get all Items or one item
    app.get('/item*', requireAuth,  items)  // yay, this works!!

}

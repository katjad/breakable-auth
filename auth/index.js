// learned this pattern from Stephen Grider Udemy Tut 
// on Authentication with React

auth = function(app){    
    var passport = require('passport')
    var GitHubStrategy = require('passport-github').Strategy;
    var session = require('express-session');
    var options = require('../appConfig');

    app.use(session({secret:'tswift', resave: true, saveUninitialized: true}))

    //Initialize passport and restore authentication state if available
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GitHubStrategy({
        clientID: options.GITHUB_CLIENT_ID || process.env.CLIENT_ID,
        clientSecret: options.GITHUB_CLIENT_SECRET || process.env.CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },
      function(accessToken, refreshToken, user, cb) {
          return cb(null, user);
      }
    ));

    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    //OAuth authentication route
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', 
      passport.authenticate('github', { failureRedirect: '/' }), 
      function(req, res) {
      res.redirect('/users');
    })
;}

module.exports = auth

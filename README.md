# Playing around with Authentication using PassportJS Github and JWT strategies

I set up this project to learn how to use Github for authentication

It is using the following repo as a starting point https://github.com/billyfung/node-beginner.git - which in turn is using the [express generator](https://expressjs.com/en/starter/generator.html)

Technologies used besides Node/Express and Passport:
- Pug viewing engine
- SQLite
- Sequelize (node module)
- LocalStorage
- History API

Some notes regarding the authentication: The initial authentication is happening through GitHub Oauth, using the [passport-github](https://github.com/jaredhanson/passport-github) library. Instead of using a session, at this step a JWT token is generated which is saved to Localstorage in the browser.

You can pass data to a template when you render it, so we can make the JWT available on the profile page like this:
```res.render('profile', {user: user, token: token})```
On the frontend, a script can then grab the token and store it in LocalStorage. 

A middleware function employing the JWT strategy is used to check if a user is logged in. The function is executed before a page with protected content is rendered. It decodes the JWT token and extracts the User ID and sees if it can be found in the database:
```const requireAuth = passport.authenticate('jwt', {session: false}```
It is using the following JWT strategy:
```
    const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
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
 ```

Depending on whether the user is logged in or not, the protected content is rendered, or the user is redirected and an error message is displayed. I used the history API for that. 

To run the project locally:

```
git clone https://github.com/katjad/breakable-auth.git
npm install

```

You will need to register a [GitHub OAuth application](https://github.com/settings/developers) and put the credentials in a file called ```appConfig.js``` at root level like this, as well as a secret to generate tokens:
```
module.exports = {
  GITHUB_CLIENT_ID: 'xxxxxxxxxxxxxxxxxxxx',
  GITHUB_CLIENT_SECRET: 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
  jwt_secret: 'supersecretstringforjwttoken'
}
```
Also, inside the ```db``` directory you will need a directory called ```data``` with a file called ```db.sqlite``` in it. 

Then run ```npm start``` and you can look at the mini app in your browser: ```http://localhost:3000```



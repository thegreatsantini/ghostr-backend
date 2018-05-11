//'use strict';

var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var db = require('./models');

module.exports = function () {

  // passport.use(new TwitterTokenStrategy({
  //     consumerKey: process.env.TWITTER_KEY,
  //     consumerSecret: process.env.TWITTER_SECRET,
  //     includeEmail: false
  //   },
  //   function (token, tokenSecret, profile, done) {
  //     db.User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
  //       return done(err, user);
  //     });
  //   }));


  //   Strategies in Passport require a `verify` function, which accept
  //   credentials, and invoke a callback with a user object.
  passport.use(new Strategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    includeEmail: false,
    callbackURL: 'http://127.0.0.1:8080/auth/return'
  },
    function(accessToken, refreshToken, profile, done) {
      // Find or save the profile
      db.User.findOne({ 'twitterId' : profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          // if a user is found, log them in
          console.log("About to call done in the passport strategy")
          // console.log(user)
          return done(null, user);
        } else {
          // if the user isnt in our database, create a new user
          var newUser = new db.User();
          // set all of the relevant information
          newUser.twitterId   = profile.id;
          newUser.displayName = profile.displayName;

          // save the user
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      })
    }
));


};

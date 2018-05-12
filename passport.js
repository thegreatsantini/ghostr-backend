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
    callbackURL: 'http://localhost:8080/auth/return'
  },
    function(accessToken, tokenSecret, profile, done) {
      // console.log('accessToken:\n', accessToken)
      // console.log('tokenSecret:\n', tokenSecret)
      console.log('profile:\n', profile)

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
          newUser.displayName = profile.username;

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

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Twitter profile is serialized
  // and deserialized.
  passport.serializeUser(function(user, cb) {
    //console.log("###########################\n",user);
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    // console.log("###########################\n",obj);
    cb(null, obj);
  });


};

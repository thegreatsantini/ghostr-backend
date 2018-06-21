require('dotenv').config();
var express  = require('express');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var db = require('./models');


passport.use(new Strategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    includeEmail: false,
    callbackURL: process.env.BASE_URL + '/auth/return'
  },
    function(accessToken, tokenSecret, profile, done) {
      // console.log('profile:\n', profile)
      
      // Find or save the profile
      db.User.findOne({ 'twitterId' : profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          // if a user is found, log them in
          console.log("Logging In: About to call done in the passport strategy");
          // console.log(profile);
          user.reputation = Math.floor((profile._json.followers_count+1) * (profile._json.friends_count+1) / (profile._json.statuses_count+1));
          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
        } else {
          // if the user isn't in our database, create a new user
          let newUser = new db.User();
          // set all of the relevant information
          newUser.twitterId   = profile.id;
          newUser.handle = profile.username;
          newUser.reputation = Math.floor(profile._json.followers_count / profile._json.statuses_count);
          newUser.pic = profile._json.profile_image_url;
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
// In order to restore authentication state across HTTP requests, Passport needs to serialize users into and deserialize users out of the session. this is as simple as supplying the user ID when serializing, and querying the user record by ID from the database when deserializing.
passport.serializeUser(function(user, done) {
  // console.log('######## serializing user:\n', user);
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  // console.log('####### deserializing user!');
  db.User.findById(id, function(err, user) {
    // console.log('deserialize callback func:', err, user);
    if (err) { 
      // console.log('########## error deserializing user:\n', err);
      done(err, null);
    }
    // console.log('######## Success deserialize:\n', user);
    done(null, user);

  });
});



module.exports = passport;
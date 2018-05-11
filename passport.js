'use strict';

var passport = require('passport');

var Strategy = require('passport-twitter').Strategy;
var db = require('./models');

module.exports = function () {

  passport.use(new TwitterTokenStrategy({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      includeEmail: false
    },
    function (token, tokenSecret, profile, done) {
      db.User.upsertTwitterUser(token, tokenSecret, profile, function(err, user) {
        return done(err, user);
      });
    }));

};
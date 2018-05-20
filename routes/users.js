const express = require('express');
const router = express.Router();
const db = require('../models');


/* GET users listing. */
router.get('/', function (req, res) {
  db.User.find(function (err, users) {
    if (err) { return console.log("****************ERROR*******************", err); }
    // console.log(users);
    res.send(users);
  });
});

// view writer's channel
router.get('/:id', function (req, res) {
  db.User.findOne({handle: req.params.id}, function (err, user) {
    if (err) { return console.log("****************ERROR*******************", err); }
    // console.log('!@#!@#!@#!@#\n', req.user); // <-- error! req.user not defined in any routes except auth/user
    // move validation/redirect logic to frontend
    // if (req.body.user.handle === req.params.id || req.body.user.subscriptions.indexOf(req.params.id) === -1) 
    //   { res.redirect(process.env.FRONTEND_URL + '/profile'); }
      //add logic: instead of redirecting to profile, if i'm not subscribed to user show user's page but hide all tweets except sample tweets and let me subscribe to user
    db.Tweet.find({"tweet_id" : {"$in" : user.writtenTweets}}, function(errorWritten, writtenTweets) { 
      if (errorWritten) { return console.log("****************ERROR*******************\n", errorWritten); }
      res.send({user: user, writtenTweets: writtenTweets});
    });
  });
});

// mark tweet as reserved/hidden on writers db and add it to logged in users db
router.put('/tweets/:tweet_id', function (req, res) {
  // db.Tweet.findOne({tweet_id: req.params.tweet_id}, function (err, tweet) { //change tweet_id to _id
    // if (err) { return console.log("****************ERROR*******************", err); }
    // tweet.reserved = true;
    // tweet.save();
    db.User.findOne({handle: req.body.user.handle}, function(error, user) {
      if (error) { return console.log("****************ERROR*******************", error); }
      user.purchasedTweets.push(req.params.tweet_id)
      user.save();
    });
  // });
});

// subscribe/unsubscribe from writer's channel
router.put('/:id', function (req, res) {
  db.User.findOne({handle: req.body.user.handle}, function(err, user) {
    if (err) { return console.log("****************ERROR*******************", err); }
    if (req.body.sub === true) {
      user.subscriptions.push(req.params.id);
      user.save();
    } else {
      user.subscriptions.splice(user.subscriptions.indexOf(req.params.id), 1);
      user.save();
    }
    console.log(user)
    res.send(user);
  });
});


module.exports = router;
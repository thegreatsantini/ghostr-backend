const express = require('express');
const router = express.Router();
// const cors = require('cors');
const db = require('../models');


// /* GET users listing. */
// router.get('/', function (req, res, next) {
//   db.User.find(function (err, users) {
//     if (err) { return console.log("****************ERROR*******************", err); }
//     res.send(users);
//   });
// });

// view writer's channel
router.get('/:id', function (req, res) {
  console.log('this is what ran',req.params.id)
    db.User.findOne({displayName: req.params.id}, function (err, user) {
    if (err) { return console.log("****************ERROR*******************", err); }
      //add logic for taking user document and checking if their id is in currently logged in user, if not or if no user is logged in, only send first 2-4 tweets and a count of rest of the tweets you could see if logged in
      console.log(user)
    res.send(user);
  });
});

// mark tweet as reserved/hidden on writers db and add it to logged in users db
router.put('/tweets/:tweet_id', function (req, res) {
  db.Tweet.findOne({tweet_id: req.params.tweet_id}, function (err, tweet) { //change tweet_id to _id
    if (err) { return console.log("****************ERROR*******************", err); }
    tweet.reserved = true;
    tweet.save();
    db.User.findOne({displayName: 'name3'}, function(error, user) { //change to currently logged in user
      if (error) { return console.log("****************ERROR*******************", error); }
      user.purchasedTweets.push(req.params.tweet_id) //change tweet_id to _id
      user.save();
    });
  });
});

// subscribe/unsubscribe from writer's channel
router.put('/:id', function (req, res) {
  db.User.findOne({displayName: 'name3'}, function(err, user) { //change 'name3' to currently logged in user
    if (err) { return console.log("****************ERROR*******************", err); }
    console.log(req.body.sub);
    if (req.body.sub == "true") { //change to boolean instead of string?
      user.subscriptions.push(req.params.id);
      user.save();
    } else {
      user.subscriptions.splice(user.subscriptions.indexOf(req.params.id), 1);
      user.save();
    }
    res.send(user);
  });
});


module.exports = router;
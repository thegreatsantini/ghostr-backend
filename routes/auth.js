var express = require('express');
var passport = require('passport');
var router = express.Router();
const db = require('../models');


// This route checks for the existence of a user in the session
router.get('/user', (req, res, next) => {
	// console.log('user is ', req.user);
	if (req.user === undefined) { res.json({user: req.user}); return console.log('No user logged in.'); }
	db.Tweet.find({"_id" : {"$in" : req.user.writtenTweets}}, function(errorWritten, writtenTweets) { 
		if (errorWritten) { return console.log("****************ERROR*******************\n", errorWritten); }
		db.Tweet.find({"_id" : {"$in" : req.user.purchasedTweets}}, function(errorPurchased, purchasedTweets) {
			if (errorPurchased) { return console.log("****************ERROR*******************\n", errorPurchased); }
			// res.json({user: req.user, writtenTweets: writtenTweets, purchasedTweets: purchasedTweets});
			db.User.find({subscriptions: req.user.twitterId}, function(errorSubs, users) {
				if (errorSubs) { return console.log("****************ERROR*******************\n", errorSubs); }
				let followers = [];
				users.forEach(singleUser => followers.push(singleUser.handle));
				res.json({user: req.user, writtenTweets: writtenTweets, purchasedTweets: purchasedTweets, followers: followers});
			});
		});
	});
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/login',
  passport.authenticate('twitter', { session: true }));

router.get('/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(process.env.FRONTEND_URL + '/profile');
});

module.exports = router;
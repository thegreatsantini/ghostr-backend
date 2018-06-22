var express = require('express');
var passport = require('passport');
var router = express.Router();
const db = require('../models');


// This route checks for the existence of a user in the session
router.get('/user', (req, res, next) => {
	// console.log('$$$$$$$$$$$$$$$$$$ res.locals.currentUser:\n' + res.locals.currentUser);
	// console.log('user is ', req.user.handle);
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

router.get('/login', passport.authenticate('twitter', 
	{session: true, 
	 successRedirect: process.env.FRONTEND_URL + '/profile', 
	 failureRedirect: process.env.FRONTEND_URL,
	 failureFlash: true,
	 successFlash: 'Welcome!' }));

// router.get('/login', function(req, res, next) {
//   passport.authenticate('twitter', function(err, user, info) {
// 	if (err) { return next(err); }
//     if (!user) { return res.redirect(process.env.FRONTEND_URL); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       	req.user = user;
// 		req.session.save(function(){
// 			return res.redirect(process.env.FRONTEND_URL + '/profile');
// 		});
//       // return res.redirect(process.env.FRONTEND_URL + '/profile');
//     });
//   })(req, res, next);
// });

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect(process.env.FRONTEND_URL + '/');
});

router.get('/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(process.env.FRONTEND_URL + '/profile');
});

module.exports = router;
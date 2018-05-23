var express = require('express');
var router = express.Router();
const db = require('../models');


// // view my purchased and written tweets
// router.get('/:id', function (req, res) {
// 	db.User.findOne({handle: req.params.id}, function(err, user) {
// 		if (err) { return console.log("****************ERROR*******************\n", err); }
// 		db.Tweet.find({"_id" : {"$in" : user.writtenTweets}}, function(errorWritten, writtenTweets) { 
// 			if (errorWritten) { return console.log("****************ERROR*******************\n", errorWritten); }
// 			db.Tweet.find({"_id" : {"$in" : user.purchasedTweets}}, function(errorPurchased, purchasedTweets) {
// 				if (errorPurchased) { return console.log("****************ERROR*******************\n", errorPurchased); }
// 				db.User.find({subscriptions: user.twitterId}, function(errorSubs, users) {
// 					if (errorSubs) { return console.log("****************ERROR*******************\n", errorSubs); }
// 					let followers = [];
// 					users.forEach(singleUser => followers.push(singleUser.handle));
// 					res.send({writtenTweets: writtenTweets, purchasedTweets: purchasedTweets, followers: followers});
// 				});
// 			});
// 		});
// 	});
// });

// // edit tweet
// router.put('/:tweet_id', function (req, res, next) {
//     db.Tweet.findOne({tweet_id: req.params.tweet_id}, function(err, tweet) {
//     	if (err) { return console.log("****************ERROR*******************\n", err); }
//     	//change 'testing'
//     	let body = req.body.testing.replace(/(\s#\w+,?)/g, ''); 
// 		let categories = req.body.testing.match(/(?<!\w)#\w+/g).map(word => word = word.replace(/#/, '')); 
// 		tweet.body = body;
// 		tweet.categories = categories;
// 		tweet.save(function(err) {
// 			if (err) { return console.log('######## error editting tweet in db:\n', err); }
// 		});
// 		res.send(tweet);
// 	});
// });

// delete tweet from db
router.delete('/:tweet_id', function (req, res){
	db.Tweet.findOne({_id: req.params.tweet_id}, function(error, tweet) {
		if (error) { return console.log("****************ERROR*******************\n", error); } 
	    db.User.findOne({handle: req.body.writer.handle}, function(err, user) {
	    	if (err) { return console.log("****************ERROR*******************\n", err); } 
			if (tweet.creator === req.body.writer.handle) {
		    	user.writtenTweets.splice(user.writtenTweets.indexOf(req.params.tweet_id), 1);
		    	user.save();
			} else {
				user.purchasedTweets.splice(user.purchasedTweets.indexOf(req.params.tweet_id), 1);
		    	user.save();
			}
		});
	    res.send('deleted tweet #' + req.params.tweet_id); //change to db id instead of custom id
    });
});

// write new tweet
router.post('/', function (req, res){
	let message = req.body.tweet;
	let body = message.replace(/(\s#\w+,?)/g, '');
	let categories = [];
	if (message.match(/(?<!\w)#\w+/g) !== null) {
		categories = message.match(/(?<!\w)#\w+/g).map(word => word = word.replace(/#/, ''));
	}
	let newTweet = new db.Tweet();
	newTweet.creator = req.body.writer.handle;
	newTweet.body = body;
	newTweet.categories = categories;
	newTweet.save(function(err) {
		if (err) { return console.log('######## error saving tweet to db:\n', err); }
	});
	db.User.findOne({handle: req.body.writer.handle}, function (err, user) {
		user.writtenTweets.push(newTweet._id);
		user.save();
	});
	res.send(newTweet);
});

// // populate tweet in preparation to post to twitter
// router.get('/post/:tweet_id', function (req, res) {
// 	db.Tweet.findOne({tweet_id: req.params.tweet_id}, function (err, tweet) {
// 		res.send(tweet);
// 	});
// });

// // post to twitter
// router.post('/post/:tweet_id', function (req, res) {

// });


module.exports = router;
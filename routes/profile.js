var express = require('express');
var router = express.Router();
const db = require('../models');


// view my purchased and written tweets
router.get('/:id', function (req, res) {
	db.User.findOne({handle: req.params.id}, function(err, user) {
		if (err) { return console.log("****************ERROR*******************\n", err); }
		// res.send({written: user.writtenTweets, purchased: user.purchasedTweets});
		// db.Tweet.find({"_id" : {"$in" : [ObjectId("55880c251df42d0466919268"), ObjectId("55bf528e69b70ae79be35006")]}});
		
		//change to _id and ObjectId
		db.Tweet.find({"tweet_id" : {"$in" : user.writtenTweets}}, function(errorWritten, writtenTweets) { 
			if (errorWritten) { return console.log("****************ERROR*******************\n", errorWritten); }
			db.Tweet.find({"tweet_id" : {"$in" : user.purchasedTweets}}, function(errorPurchased, purchasedTweets) {
				//change to _id and ObjectId 
				if (errorPurchased) { return console.log("****************ERROR*******************\n", errorPurchased); }
				db.User.find({subscriptions: user.twitterId}, function(errorSubs, users) {
					if (errorSubs) { return console.log("****************ERROR*******************\n", errorSubs); }
					let followers = [];
					users.forEach(singleUser => followers.push(singleUser.handle));
					res.send({writtenTweets: writtenTweets, purchasedTweets: purchasedTweets, followers: followers});
				});
			});
		});
	});
});

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

// TEST OUT
// delete tweet from db
router.delete('/:tweet_id', function (req, res){
	//change to db id instead of custom id
	db.Tweet.findOne({tweet_id: req.params.tweet_id}, function(error, tweet) {
		if (error) { return console.log("****************ERROR*******************\n", error); } 
	    db.User.findOne({handle: 'name4'}, function(err, user) { //change 'name4' to currently logged in user
	    	if (err) { return console.log("****************ERROR*******************\n", err); } 
			if (tweet.creator === 'name4') { //change 'name4' to currently logged in user
		    	user.writtenTweets.splice(user.writtenTweets.indexOf(req.params.id), 1);
		    	user.save();
			} else {
				user.purchasedTweets.splice(user.purchasedTweets.indexOf(req.params.id), 1);
		    	user.save();
			}
		});
	    res.send('deleted tweet #' + req.params.tweet_id); //change to db id instead of custom id
    });
});

// write new tweet
router.post('/:tweet_id', function (req, res){ //change to route '/'
	let body = req.body.testing.replace(/(\s#\w+,?)/g, '');
	let categories = req.body.testing.match(/(?<!\w)#\w+/g).map(word => word = word.replace(/#/, ''));
	var newTweet = new db.Tweet();
	newTweet.tweet_id = req.params.tweet_id; //delete tweet_id from model
	newTweet.creator = 'name1'; //change to currently logged in user from auth/sessions
	newTweet.body = body;
	newTweet.categories = categories;
	newTweet.save(function(err) {
		if (err) { return console.log('######## error saving tweet to db:\n', err); }
	});
	res.send(newTweet);
});

// populate tweet in preparation to pos to twitter
router.get('/post/:tweet_id', function (req, res) {
	db.Tweet.findOne({tweet_id: req.params.tweet_id}, function (err, tweet) {
		res.send(tweet);
	});
});

// // post to twitter
// router.post('/post/:tweet_id', function (req, res) {

// });


module.exports = router;
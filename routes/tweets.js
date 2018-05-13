var express = require('express');
var router = express.Router();
const db = require('../models');

/* GET home page. */
router.put('/:tweet_id', function (req, res, next) {
    db.Tweet.findOne({tweet_id: req.params.tweet_id}, function(err, tweet) {
    	if (err) { return console.log("****************ERROR*******************\n", err); }
    	let body = req.body.testing.replace(/(\s#\w+,?)/g, '');
		let categories = req.body.testing.match(/(?<!\w)#\w+/g).map(word => word = word.replace(/#/, ''));
		tweet.body = body;
		tweet.categories = categories;
		tweet.save(function(err) {
			if (err) { return console.log('######## error editting tweet in db:\n', err); }
		});
		res.send(tweet);
	})
});

router.delete('/:tweet_id', function (req, res){
    db.Tweet.deleteOne({tweet_id: req.params.tweet_id}, function(err, tweet) { //change to db id instead of custom id
    	if (err) { return console.log("****************ERROR*******************\n", err); } 
	    res.send('deleted tweet #' + req.params.tweet_id);
    })
})

router.post('/:tweet_id', function (req, res){
	let body = req.body.testing.replace(/(\s#\w+,?)/g, '');
	let categories = req.body.testing.match(/(?<!\w)#\w+/g).map(word => word = word.replace(/#/, ''));
	var newTweet = new db.Tweet();
	newTweet.tweet_id = req.params.tweet_id; //delete tweet_id from model
	newTweet.creator = 'name1'; //change to username variable from auth/sessions
	newTweet.body = body;
	newTweet.categories = categories;
	newTweet.save(function(err) {
		if (err) { return console.log('######## error saving tweet to db:\n', err); }
	});
	res.send(newTweet);
})


module.exports = router;

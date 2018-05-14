var express = require('express');
var router = express.Router();

router.get('/data', function(req, res) {
	db.User.find({}, function(err, users) {
		if (err) { console.log('############## error finding users:\n', err) }
		let usersIds = [];
		users.forEach(user => usersIds.push(user.twitterId));
		usersIds.sort();
		db.Tweet.find({}, function(error, tweets) {
			if (error) { console.log('############## error finding tweets:\n', error) }
			let tweetCategories = [];
			tweets.forEach(tweet => tweetCategories = tweetCategories.concat(tweet.categories));
			tweetCategories = tweetCategories.filter((word, i) => i === tweetCategories.indexOf(word));
			tweetCategories.sort();
			res.send({usersIDs: usersIds, categories: tweetCategories});
		});
	});
})

module.exports = router;
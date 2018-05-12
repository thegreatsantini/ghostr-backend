const mongoose = require('mongoose');
const db = require('./models');

const tweets_list = [
	{
		creator: 'userId2',
		body: 'String String String',
		categories: ['love', 'instagood', 'photooftheday', 'fashion', 'beautiful', 'happy', 'cute', 'tbt', 'like4like', 'followme', 'picoftheday', 'follow', 'me', 'selfie', 'summer', 'art', 'instadaily', 'friends', 'repost', 'nature', 'girl', 'fun', 'style']
	},
	{
		creator: 'userId223',
		body: 'String String String String String String',
		categories: ['love', 'instagood', 'photooftheday', 'fashion', 'beautiful', 'happy', 'cute', 'tbt', 'like4like', 'followme', 'picoftheday', 'follow', 'me', 'selfie', 'summer', 'art', 'instadaily', 'friends', 'repost', 'nature', 'girl', 'fun', 'style', 'smile', 'food', 'instalike', 'likeforlike', 'family', 'travel', 'fitness', 'igers', 'tagsforlikes', 'follow4follow', 'nofilter', 'life', 'beauty', 'amazing', 'instamood', 'instagram', 'photography', 'vscocam', 'sun', 'photo', 'music', 'beach', 'followforfollow']
	},
	{
		creator: 'userId21231',
		body: 'String String String String String String String String String',
		categories: ['bestoftheday', 'sky', 'ootd', 'sunset', 'dog', 'vsco', 'l4l', 'makeup', 'f4f', 'foodporn', 'hair', 'pretty', 'swag', 'cat', 'model', 'motivation', 'girls', 'baby', 'party', 'cool', 'lol', 'gym', 'design', 'instapic', 'funny', 'healthy', 'night', 'tflers', 'yummy']
	},
	{
		creator: 'userId123',
		body: 'String',
		categories: ['flowers', 'lifestyle', 'hot', 'instafood', 'wedding', 'fit', 'handmade', 'black', 'pink', 'blue', 'work', 'workout', 'blackandwhite', 'drawing', 'inspiration', 'home', 'holiday', 'christmas', 'nyc', 'london', 'sea', 'instacool', 'goodmorning', 'iphoneonly']
	},

]

const users_list = [
	{
		accessToken: 'String1',
		accessTokenSecret: 'String1',
		twitterId: 'String1',
		reputation: 1,
		subscriptions: ['userId1', 'userId2', 'userId3'],
	},
	{
		accessToken: 'String2',
		accessTokenSecret: 'String2',
		twitterId: 'String2',
		reputation: 2,
		subscriptions: ['userId2', 'userId5', 'userId1'],
	},
	{
		accessToken: 'String3',
		accessTokenSecret: 'String3',
		twitterId: 'String3',
		reputation: 3,
		subscriptions: ['userId2', 'userId4', 'userId8'],
	},
	{
		accessToken: 'String4',
		accessTokenSecret: 'String4',
		twitterId: 'String4',
		reputation: 4,
		subscriptions: ['userId2', 'userId123', 'userId434'],
	},
];



db.User.remove({}, function (err, users) {
	if (err) {
		console.log('Error occurred in remove', err);
	} else {
		console.log('removed all users');
		db.User.create(users_list, function (err, users) {
			console.log('adding')
			if (err) { return console.log('err', err); }
			console.log("created", users.length, "users");
			process.exit();
		});
	}
});
console.log(tweets_list[0])
db.Tweet.remove({}, function (err, tweets) {
	if (err) {
		console.log('Error occurred in remove', err);
	} else {
		console.log('removed all tweets');
		db.Tweet.create(tweets_list, function (err, tweets) {
			if (err) { return console.log('err', err); }
			console.log("created", tweets.length, "tweets");
			process.exit();
		});
	}
});
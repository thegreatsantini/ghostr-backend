const mongoose = require('mongoose');
const db = require('./models');

const users_list = [
	{
		handle: 'jingleheimer_schmit',
		twitterId: 'TI_1',
		reputation: 9001,
		subscriptions: ['TI_2', 'TI_3'],
		writtenTweets: ['1'],
		purchasedTweets: ['2', '3']
	},
	{
		handle: 'Shlomo',
		twitterId: 'longnumber',
		reputation: 150,
		subscriptions: ['@officialjadensmith', '@weratedogs', '@fuckjerry'],
		writtenTweets: ['1', '2', '3', '4'],
		purchasedTweets: ['4']
	},
	{
		handle: 'officialjadensmith',
		twitterId: 'TI_3',
		reputation: 3,
		subscriptions: ['TI_2'],
		writtenTweets: ['2'],
		purchasedTweets: ['1', '4']
	},
	{
		handle: 'Cain_Unable',
		twitterId: 'TI_4',
		reputation: 4,
		subscriptions: ['TI_2', 'TI_3'],
		writtenTweets: ['4'],
		purchasedTweets: ['3']
	}
];

const tweets_list = [
	{
		tweet_id: '1',
		creator: 'officialjadensmith',
		reserved: false,
		body: 'Once You Go In You Always Come Out Alive',
		categories: ['deep', 'truth']
	},
	{
		tweet_id: '2',
		creator: 'officialjadensmith',
		reserved: false,
		body: 'People Used To Ask Me What Do You Wanna Be When You Get Older And I Would Say What A Stupid Question The Real Question Is What Am I Right Now',
		categories: ['savage', 'thinkpeople']
	},
	{
		tweet_id: '3',
		creator: 'officialjadensmith',
		reserved: false,
		body: 'I Build Pyramids Constantly',
		categories: ['flex', 'dowork']
	},
	{
		tweet_id: '4',
		creator: 'officialjadensmith',
		reserved: false,
		body: 'If A Cup Cake Falls From A Tree How Far Away Will It Be From Down',
		categories: ['showerthoughts', 'food']
	},
	{
		tweet_id: '5',
		creator: 'Cain_Unable',
		reserved: false,
		body: 'My 4yo just said, "Daddy, why do people make up things that their children have said for social media? Isn\'t it just inherently dishonest & indicative of an inability to construct a compelling narrative themselves?',
		categories: ['meta', '2real']
	}
];

db.User.remove({}, function (err, users) {
	if (err) { return console.log('Error occurred in remove', err); }
	console.log('removed all users');
	db.User.create(users_list, function (err, users) {
		if (err) { return console.log('err', err); }
		console.log("created", users.length, "users");
		process.exit();
	});
});

db.Tweet.remove({}, function (err, tweets) {
	if (err) { return console.log('Error occurred in remove', err); }
	console.log('removed all tweets');
	db.Tweet.create(tweets_list, function (err, tweets) {
		if (err) { return console.log('err', err); }
		console.log("created", tweets.length, "tweets");
		process.exit();
	});
});
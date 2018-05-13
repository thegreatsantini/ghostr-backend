const mongoose = require('mongoose');
const db = require('./models');

const users_list = [
	{
		accessToken: 'String1',
		accessTokenSecret: 'String1',
		displayName: 'name1',
		twitterId: 'TI_1',
		reputation: 1,
		subscriptions: ['TI_2', 'TI_3'],
		writtenTweets: ['1'],
		purchasedTweets: ['2','3']
	},
	{
		accessToken: 'String2',
		accessTokenSecret: 'String2',
		displayName: 'name2',
		twitterId: 'TI_2',
		reputation: 2,
		subscriptions: ['TI_1', 'TI_3', 'TI_4'],
		writtenTweets: ['2'],
		purchasedTweets: ['1','4']
	},
	{
		accessToken: 'String3',
		accessTokenSecret: 'String3',
		displayName: 'name3',
		twitterId: 'TI_3',
		reputation: 3,
		subscriptions: ['TI_2'],
		writtenTweets: ['2'],
		purchasedTweets: ['1','4']
	},
	{
		accessToken: 'String4',
		accessTokenSecret: 'String4',
		displayName: 'name4',
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
		creator: 'name4',
		reserved: false,
		body: 'String String String',
		categories: ['love','instagood','photooftheday','fashion','beautiful','happy','cute','tbt','like4like','followme','picoftheday','follow','me','selfie','summer','art','instadaily','friends','repost','nature','girl','fun','style']
	},
	{
		tweet_id: '2',
		creator: 'name4',
		reserved: false,
		body: 'String String String String String String',
		categories: ['love','instagood','photooftheday','fashion','beautiful','happy','cute','tbt','like4like','followme','picoftheday','follow','me','selfie','summer','art','instadaily','friends','repost','nature','girl','fun','style','smile','food','instalike','likeforlike','family','travel','fitness','igers','tagsforlikes','follow4follow','nofilter','life','beauty','amazing','instamood','instagram','photography','vscocam','sun','photo','music','beach','followforfollow']
	},
	{
		tweet_id: '3',
		creator: 'name1',
		reserved: false,
		body: 'String String String String String String String String String',
		categories: ['bestoftheday','sky','ootd','sunset','dog','vsco','l4l','makeup','f4f','foodporn','hair','pretty','swag','cat','model','motivation','girls','baby','party','cool','lol','gym','design','instapic','funny','healthy','night','tflers','yummy']
	},
	{
		tweet_id: '4',
		creator: 'name2',
		reserved: false,
		body: 'String',
		categories: ['flowers','lifestyle','hot','instafood','wedding','fit','handmade','black','pink','blue','work','workout','blackandwhite','drawing','inspiration','home','holiday','christmas','nyc','london','sea','instacool','goodmorning','iphoneonly']
	}
];

db.User.remove({}, function(err, users){
	if(err) { return console.log('Error occurred in remove', err); }
	console.log('removed all users');
	db.User.create(users_list, function(err, users){
		if (err) { return console.log('err', err); }
		console.log("created", users.length, "users");
		process.exit();
	});
});

db.Tweet.remove({}, function(err, tweets){
	if(err) { return console.log('Error occurred in remove', err); }
	console.log('removed all tweets');
	db.Tweet.create(tweets_list, function(err, tweets){
		if (err) { return console.log('err', err); }
		console.log("created", tweets.length, "tweets");
		process.exit();
	});
});
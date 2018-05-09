const mongoose = require('mongoose');

const db = require('./models');

const users_list = [
	{
		OauthToken: 'String1',
	    reputation: 1,
	    subscriptions: ['one', 'two', 'three'] 
	},
	{
		OauthToken: 'String2',
	    reputation: 2,
	    subscriptions: ['four', 'five', 'six'] 
	},
	{
		OauthToken: 'String3',
	    reputation: 3,
	    subscriptions: ['seven', 'eight', 'nine'] 
	},
	{
		OauthToken: 'String4',
	    reputation: 4,
	    subscriptions: ['ten', 'eleven', 'twelve'] 
	},
];

// remove all records that match {} -- which means remove ALL records
db.User.remove({}, function(err, users){
  if(err) {
    console.log('Error occurred in remove', err);
  } else {
    console.log('removed all users');

    // create new records based on the array todos_list
    db.User.create(users_list, function(err, users){
      if (err) { return console.log('err', err); }
      console.log("created", users.length, "users");
      process.exit();
    });
  }
});


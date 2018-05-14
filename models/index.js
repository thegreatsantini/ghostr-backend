const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inkytweet', {useMongoClient: true});

module.exports.Tweet = require("./Tweet");
module.exports.User = require("./User");
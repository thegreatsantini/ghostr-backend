const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
	tweet_id: String,
    creator: String,
    body: String,
    categories: [String]
})

module.exports = mongoose.model('Tweet', tweetSchema);
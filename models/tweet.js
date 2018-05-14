const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
	tweet_id: String, //delete
    creator: String,
    reserved: Boolean,
    body: String,
    categories: [String]
})

module.exports = mongoose.model('Tweet', tweetSchema);
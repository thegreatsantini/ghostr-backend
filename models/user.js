const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    twitterId: String,
    handle: String,
    pic: String,
    reputation: Number,
    subscriptions: [String],
    writtenTweets: [String],
    purchasedTweets: [String],
})

module.exports = mongoose.model('User', userSchema);
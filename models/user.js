const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    accessToken: String,
    accessTokenSecret: String,
    twitterId: String,
    displayName: String,
    reputation: Number,
    subscriptions: [String],
    writtenTweets: [String],
    purchasedTweets: [String]
})

module.exports = mongoose.model('User', userSchema);
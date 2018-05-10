const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    creator: String,
    body: String,
    categories: [String]
})



module.exports = mongoose.model('Tweet', tweetSchema);
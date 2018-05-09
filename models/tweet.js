const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    creator: String,
    owner: String,
    body: String
})



module.exports = mongoose.model('Tweet', tweetSchema);
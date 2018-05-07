const mongoose = require('mongoose');

const tweet = new mongoose.Schema({
    creator: String,
    owner: String,
    body: String,
})



module.exports = mongoose.model('tweet', savedRecipes);
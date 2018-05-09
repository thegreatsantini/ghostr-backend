const mongoose = require('mongoose');

// if (process.env.NODE_ENV == "production") {
//   mongoose.connect(process.env.MLAB_URL)
// } else {
//   mongoose.connect('mongodb://localhost/');
// }

mongoose.connect('mongodb://localhost:27017/inkytweet');

module.exports.Tweet = require("./Tweet");
module.exports.User = require("./User");
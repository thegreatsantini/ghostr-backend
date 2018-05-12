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

// userSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
//     var that = this;
//     return this.findOne({
//       'twitterId': profile.id
//     }, function(err, user) {
//       // no user was found, lets create a new one
//       if (!user) {
//         var newUser = new that({
//             twitterId: profile.id,
//             accessToken: token,
//             accessTokenSecret: tokenSecret
//         });
//         console.log(newUser);
//         newUser.save(function(error, savedUser) {
//           if (error) {
//             console.log(error);
//           }
//           return cb(error, savedUser);
//         });
//       } else {
//         return cb(err, user);
//       }
//     });
// };

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const tweet = require('./tweet')

const userSchema = new mongoose.Schema({
    accessToken: String,
    accessTokenSecret: String,
    twitterId: String,
    reputation: Number,
    subscriptions: [String]    
})

userSchema.statics.upsertTwitterUser = function(token, tokenSecret, profile, cb) {
    var that = this;
    return this.findOne({
      'twitterId': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        var newUser = new that({
            twitterId: profile.id,
            accessToken: token,
            accessTokenSecret: tokenSecret
        });
        console.log(newUser);
        newUser.save(function(error, savedUser) {
          if (error) {
            console.log(error);
          }
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }
    });
};

// // check whether password is correct
// userSchema.methods.isAuthenticated = function (password) {
//     // compare typed in password vs. existing password in the db
//     let isCorrectPassword = bcrypt.compareSync(password, this.password);
//     return isCorrectPassword ? this : false;
// }

// // hash password before saving a user to the db
// userSchema.pre('save', function (next) {
//     // is user being updated? if yes, they already have a password which has already been hashed, so no action required.
//     let currentUser = this;
//     if (!currentUser.isModified('password')) {
//         next();
//     }
//     // user is new, so hash the password
//     else {
//         currentUser.password = bcrypt.hashSync(currentUser.password, 10);
//         next();
//     }
// })

// mongoose.model(name, schema, forceName)
// 1. name: will lowercase and pluralize for the db
// 2. schema: what does a user look like (i.e., blueprint)
// 3. forceName: (optional) force the name to something other than what #1 generates as the collection name
module.exports = mongoose.model('User', userSchema);
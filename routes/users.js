const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../models');


/* GET users listing. */
router.get('/', cors(), function (req, res, next) {
  db.User.find(function (err, users) {
    if (err){
      console.log("****************ERROR*******************", err);
    } else {
    res.send(users);
    }
  })

});

router.post('/', function (req, res) {
  console.log('add new ghost tweets here')
})

router.put('/:tweet_id', function (req, res) {
  console.log('edit an old ghost tweet here')
})

router.delete('/:tweet_id', function (req, res) {
  console.log('remove ghost tweet from userDB')
  // will we use this route when another user reserves a ghost tweet 
})

router.put('/edit', function (req, res) {
  console.log('edit user profile')
})

router.get('/:id', function (req, res) {
  console.log('view other user profiles')
})

router.put('/:id', function (req, res) {
  console.log('would we use a put here? i think we can just have add a  array of subscribed users in the model')
})

router.post('/:id/tweets', function (req, res) {
  console.log('store a resevered tweet in the user db')
})

router.delete('/:id/tweets/:tweets_id', function (req, res) {
  console.log('delete a ghostTweet from ghostWriters DB')
})

module.exports = router;
var express = require('express');
var passport = require('passport');
var router = express.Router();
const db = require('../models');
// This route checks for the existence of a user in the session
router.get('/user', (req, res, next) => {
	console.log('user is ', req.user);
	res.json({ user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/login',
  passport.authenticate('twitter', { session: true }));

router.get('/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect(process.env.FRONTEND_URL + '/profile');
});

module.exports = router;

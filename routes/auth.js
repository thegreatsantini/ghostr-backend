var express = require('express');
var passport = require('passport');
var router = express.Router();
const db = require('../models')
// This route checks for the existence of a user in the session
router.get('/user', (req, res, next) => {
	console.log('user is ', req.user);
	// if (Object.keys(req.sessionStore.sessions).length === 0 && req.sessionStore.sessions.constructor === Object) {
	// 	let key = Object.keys(req.sessionStore.sessions)[0];
	// 	userName = req.sessionStore.sessions[key].replace(/(.+displayName":")(.+)(",".+)/, '$2');
	// 	console.log('something');
	// }
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
  	// console.log("########################\n",req);
    res.redirect('http://localhost:3000/');
});

module.exports = router;

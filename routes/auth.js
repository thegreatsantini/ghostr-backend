var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function (req, res, next) {
    console.log('render login page')
});

router.post('/login', function (req, res, next) {
    console.log('authenticate login credintials and redirect to profile')
});

router.get('/signup', function (req, res, next) {
    // *********** Depends on Oauth
    console.log('render signup page')
});

router.post('/signup', function (req, res, next) {
    // *******8 depends on Oauth
    console.log('create new user and redirect to profile')
});

router.get('/logout', function (req, res, next) {
    console.log('redirect to homepage')
});

module.exports = router;

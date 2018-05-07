var express = require('express');
var router = express.Router();

/* GET home page. */
router.put('/:tweets_id', function (req, res, next) {
    console.log('edit purchased tweets')
});

router.delete('/:tweets_id', function (req, res){
    console.log('delete purchased tweets')
})


module.exports = router;

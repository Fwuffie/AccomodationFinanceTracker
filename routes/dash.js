var express = require('express');
var router = express.Router();
const Client = require('pg');

/* GET home page. */
router.all('/', function(req, res, next) {
  res.render('dash', { 
    username: 'Express',
    amount: '20',
  });
});

module.exports = router;
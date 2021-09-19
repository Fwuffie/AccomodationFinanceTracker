var express = require('express');
var router = express.Router();
const crypto = require("crypto");

const fs = require('fs');
let rawdata = fs.readFileSync('dbLogin.json');
let dbLogin = JSON.parse(rawdata);

const { Pool, Client } = require('pg');
const client = new Client(dbLogin);

/* POST check login. */
router.post('/', function(req, res, next) {

  //Authentication code
  req.session.authed = true;
  res.redirect('/dash');
  res.end();
})

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { 
    username: 'Express',
    amount: '20',
  });
});

/* POST check registration. */
router.post('/register', function(req, res, next) {
  const username = req.body.username;
  const fname = req.body.forename;
  const sname = req.body.surname;
  const salt = crypto.randomBytes(16).toString("hex");

  crypto.scrypt(req.body.password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      const query = 'INSERT INTO users(username, passwordhash, passwordsalt, forename, surname) VALUES($1, $2, $3, $4, $5);'
      console.log('hi');
      client.query(query, [username, derivedKey, salt, fname, sname], (err, res) => {
        console.log(res);
        if (err){
          console.log('err.stack');
        }

        req.session.authed = true;
        res.redirect('/dash');
        res.end();
      });

      
  });
})

/* GET registration page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

module.exports = router;
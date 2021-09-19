var express = require('express');
var router = express.Router();

var session = require('express-session');

const fs = require('fs');
let rawdata = fs.readFileSync('dbLogin.json');
let dbLogin = JSON.parse(rawdata);

const { Pool, Client } = require('pg');
const client = new Client(dbLogin);

var dashRouter = require('./routes/dash.js');
var loginRouter = require('./routes/login.js');

var app = express();

// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.use(session({
  secret: 'puppy sky bison',
  resave: false,
  saveUninitialized: true,
}));

app.use('/login', loginRouter);

app.use('*', (req, res, next) => {
  if (req.session.authed) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.use('*', dashRouter);

module.exports = app;
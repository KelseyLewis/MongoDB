var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

  

//first call passport, 
router.post('/login', passport.authenticate('local'), (req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are logged in!'});
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    error.status = 403;
    next(err);
  }
});

module.exports = router;

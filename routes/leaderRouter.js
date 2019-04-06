const express = require('express');
const bodyParser = require('body-parser');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

//ALL leaders
leaderRouter.route('/')
 //get request on leaders
 .get( (req,res,next) => {
  Leaders.find({})
    .then((leaders) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
//posting a new leadertion to the server
.post((req, res, next) => {
  Leaders.create(req.body)
  .then((leaders) => {
    console.log(`Leader ${leaders} created`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(leaders);
  }, (err) => next(err))
  .catch((err) => next(err)); 
})  
//doesn't make sense to put in this case, we're already posting with post
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
  Leaders.remove({})
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err)); 
});

//leaderID
leaderRouter.route('/:leaderId')
.get((req,res,next) => {
Leaders.findById(req.params.leaderId)
.then((leader) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(leader);
}, (err) => next(err))
.catch((err) => next(err)); 
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put((req, res, next) => {
Leaders.findByIdAndUpdate(req.params.leaderId, {
  $set: req.body
}, { new: true })
.then((leader) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(leader);
}, (err) => next(err))
.catch((err) => next(err)); 
})
.delete((req, res, next) => {
Leaders.findByIdAndRemove(req.params.leaderId)
.then((resp) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json(resp);
}, (err) => next(err))
.catch((err) => next(err)); 
});


module.exports = leaderRouter;
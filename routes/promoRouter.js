const express = require('express');
const bodyParser = require('body-parser');
const Promos = require('../models/promotions');
const promoRouter = express.Router();
const authenticate = require('../authenticate'); 
const cors = require('./cors');

//ALL PROMOTIONS
promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
  //get request on promos
  .get(cors.cors, (req,res,next) => {
    Promos.find(req.query)
      .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
      }, (err) => next(err))
      .catch((err) => next(err));
})
  //posting a new promotion to the server
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promos.create(req.body)
    .then((promos) => {
      console.log(`Promotion ${promos} created`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(promos);
    }, (err) => next(err))
    .catch((err) => next(err)); 
})  
  //doesn't make sense to put in this case, we're already posting with post
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promos');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promos.remove({})
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)); 
});

//promoID
promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
  Promos.findById(req.params.promoId)
  .then((promo) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promo);
  }, (err) => next(err))
  .catch((err) => next(err)); 
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promos/'+ req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.findByIdAndUpdate(req.params.promoId, {
    $set: req.body
  }, { new: true })
  .then((promo) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(promo);
  }, (err) => next(err))
  .catch((err) => next(err)); 
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Promos.findByIdAndRemove(req.params.promoId)
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err)); 
});

module.exports = promoRouter;
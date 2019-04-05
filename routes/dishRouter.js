const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//ALL DISHES
dishRouter.route('/')
  //get request on dishes
.get( (req,res,next) => {
    Dishes.find({})
      .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
      }, (err) => next(err))
      .catch((err) => next(err));
})
  //posting a new dish to the server
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dishes) => {
      console.log(`Dish ${dishes} created`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err)); 
})  
  //doesn't make sense to put in this case, we're already posting with post
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)); 
});

//dishID
dishRouter.route('/:dishId')
.get((req,res,next) => {
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dish);
  }, (err) => next(err))
  .catch((err) => next(err)); 
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set: req.body
  }, { new: true })
  .then((dish) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dish);
  }, (err) => next(err))
  .catch((err) => next(err)); 
})
.delete((req, res, next) => {
  Dishes.findByIdAndRemove(req.params.dishId)
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err)); 
});

//ALL COMMENTS FOR A DISH
dishRouter.route('/:dishId/comments')
  //get request on dishes
.get( (req,res,next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish!=null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments);
        } else {
          new Error('Dish ' + req.params.dishId + ' not found.');
          err.status = 404;
          return next(err);
        }
      }, (err) => next(err))
      .catch((err) => next(err));
})
  //posting a new dish to the server
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
      if (dish!=null) {
        dish.comments.push(req.body);
        dish.save()
        .then((dish) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);
        })
      } else {
        new Error('Dish ' + req.params.dishId + ' not found.');
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err)); 
})  
  //doesn't make sense to put in this case, we're already posting with post
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
      if (dish!=null) {
        for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save()
        .then((dish) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish);
        })
      } else {
        new Error('Dish ' + req.params.dishId + ' not found.');
        err.status = 404;
        return next(err);
      }
    }, (err) => next(err))
    .catch((err) => next(err)); 
});

//commentID
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    //dish exists and comments exist for the dish
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish.comments.id(req.params.commentId));
    } else if (dish == null) {
      new Error('Dish ' + req.params.dishId + ' not found.');
      err.status = 404;
      return next(err);
    } else {
      new Error('Comment ' + req.params.commentId + ' not found.');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId) + '/comments/' + req.params.commentId;
})
.put((req, res, next) => {
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    //dish exists and comments exist for the dish
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
      if (req.body.rating) {
        dish.comments.id(req.params.commentId).rating = req.body.rating
      }
      if (req.body.comment) {
        dish.comments.id(req.params.commentId).comment = req.body.comment
      }
      dish.save()
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err))
      .catch((err) => next(err)); 
    } else if (dish == null) {
      new Error('Dish ' + req.params.dishId + ' not found.');
      err.status = 404;
      return next(err);
    } else {
      new Error('Comment ' + req.params.commentId + ' not found.');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err)); 
})
.delete((req, res, next) => {
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    if (dish!=null && dish.comments.id(req.params.commentId) != null) {
      dish.comments.id(req.params.commentId).remove();
      dish.save()
      .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
      }, (err) => next(err));
    } else if (dish == null) {
      new Error('Dish ' + req.params.dishId + ' not found.');
      err.status = 404;
      return next(err);
    } else {
      new Error('Comment ' + req.params.commentId + ' not found.');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err)); 
});

module.exports = dishRouter;
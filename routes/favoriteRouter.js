const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorites');
const authenticate = require('../authenticate');
const favoriteRouter = express.Router();
const cors = require('./cors');
var mongoose = require('mongoose');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    //make sure that you only get the dishes that the user has favorited
    //i.e. one favorite document with array of dishes objectIDs
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
});
// .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     Favorites.create(req.body)
//     .then((favorite) => {
//       console.log(`Favorite ${favorite} created`);
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json(favorite);
//     }, (err) => next(err))
//     .catch((err) => next(err)); 
// })  
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Dishes.findById(req.params.dishId)
//     .then((dish) => {
//         if (dish != null) {
//             req.body.author = req.user._id;
//             dish.comments.push(req.body);
//             dish.save()
//             .then((dish) => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(dish);                
//             }, (err) => next(err));
//         }
//         else {
//             err = new Error('Dish ' + req.params.dishId + ' not found');
//             err.status = 404;
//             return next(err);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
//   //doesn't make sense to put in this case, we're already posting with post
// .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /favorites');
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     //can only delete if user = poster

//     console.log(`user id = ${req.user._id}
//     favorite poster: ${dish.comments.id(req.params.commentId).author._id}`)
//     //if(req.user._id.equals(dish.comments.id(req.params.commentId).author._id)) {
//     if (dish.comments.id(req.params.commentId).author._id.toString() != req.user._id.toString()) {
          
//     Favorites.remove({})
//     .then((resp) => {
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json(resp);
//     }, (err) => next(err))
//     .catch((err) => next(err)); 
// });

// . . .

// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

// . . .

//                 favorite.save()
//                 .then((favorite) => {
//                     Favorites.findById(favorite._id)
//                     .populate('user')
//                     .populate('dishes')
//                     .then((favorite) => {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(favorite);
//                     })
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 });
                
// . . .

//         else {
//             for (i = 0; i < req.body.length; i++ )
//                 if (favorite.dishes.indexOf(req.body[i]._id) < 0)                                  
//                     favorite.dishes.push(req.body[i]);
//             favorite.save()
//             .then((favorite) => {
//                 Favorites.findById(favorite._id)
//                 .populate('user')
//                 .populate('dishes')
//                 .then((favorite) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(favorite);
//                 })
//             })
//             .catch((err) => {
//                 return next(err);
//             });
            
// . . .

// favoriteRouter.route('/:dishId')

// . . .

// .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
//     Favorites.findOne({user: req.user._id})
//     .then((favorites) => {
//         if (!favorites) {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             return res.json({"exists": false, "favorites": favorites});
//         }
//         else {
//             if (favorites.dishes.indexOf(req.params.dishId) < 0) {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 return res.json({"exists": false, "favorites": favorites});
//             }
//             else {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 return res.json({"exists": true, "favorites": favorites});
//             }
//         }

//     }, (err) => next(err))
//     .catch((err) => next(err))
// })

// . . .

// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

// . . .

//                 favorite.dishes.push({ "_id": req.params.dishId });
//                 favorite.save()
//                 .then((favorite) => {
//                     Favorites.findById(favorite._id)
//                     .populate('user')
//                     .populate('dishes')
//                     .then((favorite) => {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(favorite);
//                     })
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 });
                
// . . .

//         else {
//             if (favorite.dishes.indexOf(req.params.dishId) < 0) {                
//                 favorite.dishes.push(req.body);
//                 favorite.save()
//                 .then((favorite) => {
//                     Favorites.findById(favorite._id)
//                     .populate('user')
//                     .populate('dishes')
//                     .then((favorite) => {
//                         res.statusCode = 200;
//                         res.setHeader('Content-Type', 'application/json');
//                         res.json(favorite);
//                     })
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 })
//             }
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorites.findOne({user: req.user._id}, (err, favorite) => {
//         if (err) return next(err);
//         var index = favorites.dishes.indexOf(req.params.dishId)
//         if (index >= 0) {
//             favorites.dishes.splice(index,1);
//             favorites.save()
//             .then((favorite) => {
//                 Favorites.findById(favorite._id)
//                 .populate('user')
//                 .populate('dishes')
//                 .then((favorite) => {
//                     res.statusCode = 200;
//                     res.setHeader('Content-Type', 'application/json');
//                     res.json(favorite);
//                 })
//             })
//         }
//     })

    module.exports = favoriteRouter; 
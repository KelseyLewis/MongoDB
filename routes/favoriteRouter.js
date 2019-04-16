const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorites');
const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
const favoriteRouter = express.Router();
const cors = require('./cors');
var mongoose = require('mongoose');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    //get the favorites for this user 
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        //if there are no favorites, return that exists = false
        if (!favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json(`You have no favorites!`);
        }
        else {
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json(favorite);
            });
        }
    })
    .catch((err) => next(err))
})
//FINISH POSTING MULTIPLE
.post(cors.cors, authenticate.verifyUser, (req,res,next) => {
    //get the favorite document for this user
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        // if no favorites currently exist for this user, create a favorite documentand add this dish/es
        console.log(`favorite = ${favorite}`);
        if (!favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //create a new document
            Favorites.create({user: req.user._id, dishes: []}, (err, doc) => {
                if (err) {
                    return  next(err);
                }
                else {
                    console.log("Document inserted");
                }
            });
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json(favorite);
            })
            .catch((err) => {
                return next(err);
            });

        }
        //if dishes already exist in favorites (i.e. !null) then add dishes
        else { 
            favorite.dishes.push({ "_id": req.params.dishId });
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json(favorite);
                })
            })
            .catch((err) => {
                return next(err);
            });
        }
    })
    .catch((err) => {
        return next(err);
    });
})
.delete(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err)); 
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200); })
//ONLY RETURN ONE VALUE
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    //get the favorites for this user 
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        //if there are no favorites, return that exists = false
        if (!favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json(`You have no favorites!`);
        }
        else {
            // if the dish doesn't exist in the list of favorites, return exists as false
            if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                Dishes.findById(req.params.dishId)
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json(`${dish.name} is not in your favorites!`);
                });
            }
            else { //(favorite.dishes.indexOf(req.params.dishId) > -1) : the dish is a favorite, return the dish
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json(favorite);
                });
            }
        }
    })
    .catch((err) => next(err))
})
.post(cors.cors, authenticate.verifyUser, (req,res,next) => {
    //get the favorite document for this dishID
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        // if no favorites currently exist for this user, create a favorite document
        //and add this dish
        console.log(`favorite = ${favorite}`);
        if (!favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            //create a new document
            Favorites.create({user: req.user._id, dishes: [req.params.dishId]}, (err, doc) => {
                if (err) {
                    return  next(err);
                }
                else {
                    console.log("Document inserted");
                }
            });
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json(favorite);
            })
            .catch((err) => {
                return next(err);
            });

        }
        //dish already exists in favorites, return the dish with a message
        else if (favorite.dishes.indexOf(req.params.dishId) > -1) { 
            Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(`${dish.name} is already a favorite!`);
            }, (err) => next(err))
            .catch((err) => {
                return next(err);
            });
        }
        //if dish is not a favorite, ad the user id, push the
        // dishId, and report by populating these fields 
        else if (favorite.dishes.indexOf(req.params.dishId) < 0) {               
            req.body.user = req.user._id;
            favorite.dishes.push({ "_id": req.params.dishId });
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json(favorite);
                })
            })
            .catch((err) => {
                return next(err);
            });
        }
    })
    .catch((err) => {
        return next(err);
    });
})
.delete(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (!favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json(`You have no favorites to delete!`);
        }
        //if dish is not a favorite
        else if (favorite.dishes.indexOf(req.params.dishId) < 0) { 
            Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json(`${dish.name} cannot be deleted from your favorites because it is not a favorite.`);
            }, (err) => next(err))
            .catch((err) => {
                return next(err);
            });              
        }
        //dish exists in favorites, delete it from favorites {pull}
        else if (favorite.dishes.indexOf(req.params.dishId) > -1) { 
            favorite.dishes.pull(req.params.dishId);
            favorite.save();
            Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(`${dish.name} was deleted from  your favorites.`);
            }, (err) => next(err))
            .catch((err) => {
                return next(err);
            });
        }
    })
    .catch((err) => {
        return next(err);
    });
});

module.exports = favoriteRouter; 


   
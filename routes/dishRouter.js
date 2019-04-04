const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//ALL DISHES
dishRouter.route('/')
//when a request comes in, for all of the requests
//for the /dishes rest api endpoint, execute this code
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
      //call the next function
      //will continue on to look for additional specs below that will
      //match this /dishes endpoint
    next();
})
  //get request on dishes
.get( (req,res,next) => {
      res.end('Will send all the dishes to you!');
})
  //posting a new dish to the server
.post((req, res, next) => {
   res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})  
  //doesn't make sense to put in this case, we're already posting with post
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
      res.end('Deleting all dishes');
});

//dishID
dishRouter.route('/:dishId')
.get((req,res,next) => {
      res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + 
          ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
      res.end('Deleting dish: ' + req.params.dishId);
});

module.exports = dishRouter;
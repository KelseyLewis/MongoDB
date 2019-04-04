const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//ALL PROMOTIONS
promoRouter.route('/')
//when a request comes in, for all of the requests
//for the /promotions rest api endpoint, execute this code
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
      //call the next function
      //will continue on to look for additional specs below that will
      //match this /promotions endpoint
    next();
})
  //get request on promotions
.get( (req,res,next) => {
      res.end('Will send all the promotions to you!');
})
  //posting a new promotion to the server
.post((req, res, next) => {
   res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})  
  //doesn't make sense to put in this case, we're already posting with post
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
      res.end('Deleting all promotions');
});

//promoID
promoRouter.route('/:promoId')
.get((req,res,next) => {
      res.end('Will send details of the promotion: ' + req.params.promoId +' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put((req, res, next) => {
    res.write('Updating the promotion: ' + req.params.promoId + '\n');
    res.end('Will update the promotion: ' + req.body.name + 
          ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
      res.end('Deleting promotion: ' + req.params.promoId);
});

module.exports = promoRouter;
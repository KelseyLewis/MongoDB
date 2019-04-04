const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

//ALL leaders
leaderRouter.route('/')
//when a request comes in, for all of the requests
//for the /leaders rest api endpoint, execute this code
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
      //call the next function
      //will continue on to look for additional specs below that will
      //match this /leaders endpoint
    next();
})
  //get request on leaders
.get( (req,res,next) => {
      res.end('Will send all the leaders to you!');
})
  //posting a new leader to the server
.post((req, res, next) => {
   res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})  
  //doesn't make sense to put in this case, we're already posting with post
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
      res.end('Deleting all leaders');
});

//leaderID
leaderRouter.route('/:leaderId')
.get((req,res,next) => {
      res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put((req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + 
          ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
      res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;
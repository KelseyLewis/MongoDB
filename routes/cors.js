const express = require('express');
const cors = require('cors');
const app = express();

//array of strings that represent all of the origins the server is willing to accept
var whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://KelseysMacBookAir:3001', 'http://localhost:4200']

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
 
    //see if the request header is part of the whitelist
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        //access control  = allow origin if origin = true
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false};
    }

    callback(null, corsOptions);
};

module.exports.cors = cors();
module.exports.corsWithOptions = cors(corsOptionsDelegate);
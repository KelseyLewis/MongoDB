const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.js');
var googleTokenStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.local = passport.use(new LocalStrategy(User.authenticate()));

//provided on user schema and model by way of passport local mongoose plugin
//session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});

// This function will check an ordinary user to see if s/he has Admin privileges.
//In order to perform this check, note that all users have an additional field
// stored in their records named admin, that is a boolean flag, set to false by 
//default.Furthermore, when the user's token is checked in verifyUser() function,
// it will load a new property named user to the request object.
//This will be available to you if the verifyAdmin() follows verifyUser() in the
// middleware order in Express. From this req object, you can obtain the admin 
//flag of the user's information by using the following expression: req.user.admin
//You can use this to decide if the user is an administrator. The verifyAdmin()
// function will call next(); if the user is an Admin, otherwise it will return
// next(err); If an ordinary user performs this operation, you should return 
//an error by calling next(err) with the status of 403, and a message 
//"You are not authorized to perform this operation!".
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    }
    else {
        var err = new Error('You are not an admin!');
        err.status = 403;
        next(err);
    }
};

exports.googlePassport = passport.use(new googleTokenStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    //callbackURL: 
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (!err && user !== null) {
                return done(null, user);
            }
            else { //if user doesn't exist, create a new user
                user = new User({username: profile.displayName});
                user.googleId = profile.id;
                user.firstname = profile.name.given_name;
                user.lastname = profile.name.family_name;
                user.save((err, user) => {
                    if (err) {
                        return done(err, false);
                    }
                    else {
                        return done(null, user);
                    }
                });
            }
        })     
        // return done(null, {
        //     profile: profile,
        //     token: token
        // });
    })
);


// module.exports = (passport) => {
//     passport.use(new GoogleStrategy({
//             clientID: %your_client_ID%,
//             clientSecret: %your_client_secret%,
//             callbackURL: %your_callback_url%
//         },
//         (token, refreshToken, profile, done) => {
//             return done(null, {
//                 profile: profile,
//                 token: token
//             });
//         }));
// };
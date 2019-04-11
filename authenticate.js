const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

//provided on user schema and model by way of passport local mongoose plugin
//session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
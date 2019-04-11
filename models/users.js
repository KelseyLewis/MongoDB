const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport');

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    }
});

//adds hashed username and password
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
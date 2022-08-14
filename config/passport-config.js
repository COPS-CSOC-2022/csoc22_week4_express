const localStrategy = require("passport-local");
const User = require("../models/user");


function initialize(passport) {
    passport.use(new localStrategy(function verify(username, password, cb){
        User.findOne({ 
            username: username
        }, function (err, user) {
            if (err) return cb(err);
            if (!user) { 
                return cb(null, false, {message: 'Incorrect username or password.'});
            }
            user.comparePassword(password, function (err, isMatch) {
                if (err) cb(err);
                if (isMatch) return cb(null, user);
                else return cb(null, false, {message: 'Incorrect username or password.'});
            });
        });
    }));     
    
    passport.serializeUser(User.serializeUser());             // Used to serialize the user for the session
    passport.deserializeUser(User.deserializeUser());         // Used to deserialize the user

}

module.exports = initialize;
const LocalStrategy = require('passport-local').Strategy;
const passport=require('passport')
const userModel=require("../models/user.js")

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ username: 'email' }, (username, password, done) => {
      
      userModel.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That user is not registered' });
        }
        if(password==user.password)return done(null, user);
        else return done(null, false, { message: 'Password incorrect' });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
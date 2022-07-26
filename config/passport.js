const LocalStrategy = require('passport-local').Strategy;

// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ username: 'username' }, (username, password, done) => {
      // Match user
      User.findOne({
        username: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That user is not registered' });
        }
        if(password===user.password)return done(null, user);
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
var passport = require('passport');
var Account = require('../models/user');

var getLogin = (req, res) => {
  //TODO: render login page
  res.render('signin');
};

var postLogin = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
})

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logOut()
  res.redirect('/');
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render("signup");
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
          res.send("Choose a different username");
    }
    passport.authenticate('local')(req, res, function () {
        res.redirect('/');
    });
});

};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

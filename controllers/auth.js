const User = require('../models/user');
const passport = require('passport');

var getLogin = (req, res) => {
  res.render('login', { title: 'Login' });
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) console.log(err);
    else {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/');
      })
    }
  })
  
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout()
  res.redirect('/login')
};

var getRegister = (req, res) => {
  res.render('register', { title: 'Register' });
};

var postRegister = async (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  const user = new User({
    username: req.body.username,
  });
  User.register(user, req.body.password, function (err, user) {
    if (err) {
      res.json({ success: false, message: 'Error: ', err });
    } else {
      res.redirect('/login');
    }
  });
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

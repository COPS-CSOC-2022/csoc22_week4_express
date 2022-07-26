const passport = require('passport');
const User = require('../models/user');

var getLogin = (req, res) => {
  //TODO: render login page
  if(req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    res.render('login', { title: 'Login' });
  }
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page

  const user = new User({
    username: req.body.username,
    password: req.body.password,
  })

  req.login(user, (err) => {
    if(err) {
      console.log(err);
    }
    else {
      passport.authenticate('local',{failureRedirect : '/loginError'})(req, res, () => {
        res.redirect('/');
      })
    }
  })
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  res.redirect('/');
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render('register', { title: "Register" });
};

var postRegister = async (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page

  User.register({ name: req.body.name, username: req.body.username}, 
    req.body.password, 
    (err, user) => {
    if(err) {
      console.log(err);
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/');
      })
    }
  });
};

var loginError = (req,res) => {
    res.render('loginError', {title : 'Error!'})
}

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
  loginError
};

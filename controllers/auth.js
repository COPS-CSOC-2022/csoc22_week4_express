var User = require('../models/user')
const passport = require('passport');

var getLogin = (req, res) => {
  res.render("login", { title: "Books_kakashi" });
};

var postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    faiulerFlash: true
  })(req, res, next);
};

var logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have been logged out successfully ....');
  res.redirect('/login');
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render("register", { title: "Books_kakashi" });
};

var postRegister = (req, res) => {
  let errors = [];
  const { username, email, password, password2 } = req.body;
  console.log(req.body)

  if (password != password2) {
    errors.push({ msg: 'The passwords donot match' });
  }
  if (password.length < 10) {
    errors.push({ msg: 'Length of passwrod must be greater than 10 letters' });
  }


  if (errors.length > 0) {
    console.log(errors)
    res.render('register', { errors, username, email, password, password2, title: "Kakashi_Library" });

  }
  else {

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          errors.push({ msg: 'The email alreadr exits.Please register with another email...' });
          res.render('register', { errors, username, email, password, password2, title: "Kakashi_Library" });
          console.log(errors)
        }
        else {
          const newUser = new User({ username, email, password });
          newUser.save()
            .then(user => {
              req.flash('success_msg', 'You are now registered successfully..');
              res.redirect('/login');
            })
            .catch(err => console.log(err));
        }
      })
  }
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

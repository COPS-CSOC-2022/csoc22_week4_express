const passport = require('passport');
const User = require("../models/user");
const passwordValidators = require('../utils/passwordValidators');

var getLogin = (req, res) => {
  res.render('login', {
    title: 'Login',
    errorMessage: req.flash('errorMessage')
  })
};


var postLogin = (req, res, next) => {
  if (req.body.username === '' || req.body.password === '') {
    return res.render('login', {
      title: 'Login',
      errorMessage: 'Username and password cannot be blank.'
    });
  }

  req.flash('errorMessage', '');
  passport.authenticate('local', function (err, user, info) {
    if (err) console.log(err);
    if (!user)
      return res.render('login', {
        title: 'Login',
        errorMessage: info.message
      });

    req.logIn(user, function (err) {
      if (err) console.log(err);
      return res.redirect('/books');
    });
  })(req, res, next);
};

var logout = (req, res) => {
  req.logout();
  req.flash('successMessage', 'You have been logged out successfully.');
  res.redirect('/');
};

var getRegister = (req, res) => {
  res.render('register', {
    title: 'Register',
    errorMessage: req.flash('errorMessage')
  });
};


var postRegister = (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    /* Check all fields must be entered */
    if (!password || !username || !confirmPassword) {
      req.flash('errorMessage', 'Please enter all fields.');
      return res.redirect('/register');
    }

    /* Checks if the username is unique */
    passwordValidators.doesUsernameExists(username).then((usernameExists) => {
      if (!usernameExists[0]) {
        req.flash('errorMessage', usernameExists[1]);
        return res.redirect('/register');
      }
    });

    /* Check if the password is strong */
    let strongPassword = passwordValidators.isStrongPassword(password);
    if (!strongPassword[0]) {
      req.flash('errorMessage', strongPassword[1]);
      return res.redirect('/register');
    }

    /* Checks if the passwords are matching */
    if (password != confirmPassword) {
      req.flash('errorMessage', 'Password and Confirm Password are not same!');
      return res.redirect('/register');
    }

    /* Saving the user to the database */
    let newUser = new User({
      username: username,
      password: password
    });

    newUser.save(function (err) {
      if (err) {
        res.render('register', {
          title: 'Register',
          errorMessage: err.message
        });
        return;
      }

      console.log('User saved successfully');

      /* Login the user */
      passport.authenticate("local")(req, res, () => {
        console.log("Authenticated user.");
        req.flash('successMessage', 'You have been registered as well as logged in successfully.');
        res.redirect("/");
      })

    });
  }
  catch {
    res.render('register', {
      title: 'Register',
      errorMessage: 'Something went wrong. Please try again later.'
    });
  }

};


module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

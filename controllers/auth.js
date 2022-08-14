const passport = require('passport');
const User = require("../models/user");


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
      res.render('register', {
        title: 'Register',
        errorMessage: 'Please enter all fields.'
      });
      return;
    }

    /* Checks if the username is unique */
    
    /* Check if the password is strong */
    

    /* Checks if the passwords are matching */
    if (password != confirmPassword) {
      res.render('register', {
        title: 'Register',
        errorMessage: 'Password and Confirm Password are not same!'
      });
      return;
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
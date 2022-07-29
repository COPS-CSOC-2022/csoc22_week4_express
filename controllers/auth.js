const passport = require("passport");
const User = require("../models/user.js");    //User model

var getLogin = (req, res) => {
  //TODO: render login page
  res.render('login', { title: "Login"})
};

var postLogin = (req, res, next) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  let errors = [];
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      //Redirecting to login page in case of error 
      errors.push({ msg: "Incorrect username or password" });
      return res.render('login', { title: "Login", errors })
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  res.redirect('/');
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render('register', { title: "Register"})
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  const { firstname, lastname, username, email, password } = req.body;
  let errors = [];

  //Checking password length
  if(password.length < 8){
    errors.push({ msg: "Password should be atleast 8 characters long" });
  }

  if(errors.length > 0){
    res.render('register', { title: "Register", errors, firstname, lastname,  username });
  }
  else{
    //Validation passed
    User.findOne({ email: email })
      .then(user => {
        if(user) {
          //User exists
          errors.push({ msg: "Entered email is already registered" });
          res.render('register', { title: "Register", errors, firstname, lastname, username })
        }
        else{
          const newUser = new User({ firstname, lastname,  username, email, password });
          console.log(newUser);
          User.register({ 
            firstname: firstname, 
            lastname: lastname, 
            username: username, 
            email:email }, 
            password, (err, user) => {
              if(err) {
                console.log(err);
              }
              else{
                passport.authenticate('local')(req, res, () => {
                  res.redirect('/');
                })
              }
            })
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

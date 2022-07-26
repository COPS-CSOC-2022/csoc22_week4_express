const passport = require('passport');
var User = require("../models/user");

var getLogin = (req, res) => {
  //TODO: render login page
  res.render("login", {title: "AJ BOOKS LIBRARY"})
};

var postLogin = (req, res, next) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  req.flash('success_msg', 'Logged Out Successfully');
  res.redirect('/login');
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render('register', {title: "AJ BOOKS LIBRARY"});
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  let errorsList = [];
  const { username, email, password, password2 } = req.body;
  const newUser = new User({username,email,password});
  console.log(req.body)

  if (password != password2) {
    errorsList.push({ msg: 'Both Passwords does not match' });
  }
  if(password.length<8){
    errorsList.push({ msg: 'Password length must be greater than 8 characters' });
  }

  
  if (errorsList.length) {
    res.render('register', {errorsList,username,email,password,password2,title: "AJ BOOKS LIBRARY"});
    
  }
  else {
    
    User.findOne({email : email})
    .then((user)=>{
      if(user){
        errorsList.push({msg:'Email already exists' });
        res.render('register',{errorsList,username,email,password,password2,title: "AJ BOOKS LIBRARY"});
      }
      else{
        newUser.save()
        .then(user => {req.flash('success_msg','Successfully registered');
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

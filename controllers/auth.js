
var User = require("../models/user");
const passport = require('passport');

var getLogin = (req, res) => {
  //TODO: render login page
  res.render('login', {title: "Library"});
};

var postLogin = (req, res,next) => {
  // TODO: authenticate using passport
  console.log("Hello")
  //On successful authentication, redirect to next page
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  req.flash('success_msg', 'You are Succesfully logged out');
  res.redirect('/login');
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render('register', {title: "Library"});
};
 
var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  let errors = [];
  const { username, email, password, password2 } = req.body;
  console.log(req.body)

  if (password != password2) {
    errors.push({ msg: 'Both Passwords entered by you does not match' });
  }
  if(password.length<7){
    errors.push({ msg: 'Password length must be greater than 7 characters' });
  }

  
  if (errors.length > 0) {
    console.log(errors)
    res.render('register', {errors,username,email,password,password2,title: "Library"});
    // console.log('hello')
    
  }
  else {
    
    User.findOne({email : email})
    .then((user)=>{
      if(user){
        errors.push({msg:'This Email already exists, Please use another email to Register yourself in the Library' });
        res.render('register',{errors,username,email,password,password2,title: "Library"});
        console.log(errors)
      }
      else{
        // console.log('bye')
        const newUser = new User({username,email,password});
        newUser.save()
        .then(user => {req.flash('success_msg','You are now Successfully Registered in the Library and can Log in');
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

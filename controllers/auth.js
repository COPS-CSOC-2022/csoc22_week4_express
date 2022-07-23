const User = require('../models/User')
const passport = require('passport');
const { response } = require('express');
var getLogin = (req, res) => {
  //TODO: render login page
  res.render('login' ,{title:"Login"})
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  const user = new User({
    username:req.body.username,
    password:req.body.password
  })
  req.login(user,(err)=>{
if(err) console.log(err);
else {
  passport.authenticate('local')(req,res,()=>{
    res.redirect('/books')
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
  // TODO: render register page
  res.render('register',{title:"Register"});
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  console.log("The body of the request is" , req.body);
  // res.status(200).json(req.body)
  // if(existAlready) res.status(400).send("User with this username already exist")

  User.register({username: req.body.username,email:req.body.email} ,req.body.password , (err, user)=>{
    if(err){
      console.log(err.message);
      res.status(400).json(err.message)
      // res.status(400).redirect('/register')
    }
    else{
      console.log(`User added successfully ${user}`);
      passport.authenticate('local')(req,res,()=>{
        res.redirect('/')
      })      
    }

  })
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

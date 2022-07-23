const User = require('../models/user');
const passport = require('passport');
var getLogin = (req, res) => {
  //TODO: render login page
  try{if(req.isAuthenticated()) {
    res.redirect('/');
  }else{
    res.status(200).render('login',{title:"Books | Login"});
  }}catch(err){
    res.status(500).send("Internal Server Error");
  }
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page

  try{req.login(new User({username:req.body.username,password:req.body.password}), (err)=>{
    if(err){
      res.status(400).send(err);
    }else{
      passport.authenticate("local")(req,res,()=>{
        res.status(200).redirect("/");
      });
    }
  });}catch(err){
    res.status(500).send("Internal Server Error");
  }
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
    try{req.logout();
    res.status(200).redirect('/login');}
    catch(err){
      res.status(500).send("Internal Server Error");
    }
  }


var getRegister = (req, res) => {
  // TODO: render register page
  try{if(req.isAuthenticated()) {
    res.redirect('/');
  }else{
    res.status(200).render('register',{title:"Books | Register"});
  }}catch(err){
    res.status(500).send("Internal Server Error");
  }
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  try{User.register({username: req.body.username}, req.body.password,(err)=>{
    if(!err){
      passport.authenticate("local")(req,res,()=>{
        res.status(200).redirect('/');
      })
    }
    else{
      res.status(400).send(err);
    }
  });}catch(err){
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

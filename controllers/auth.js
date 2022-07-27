const passport= require('passport')
const LocalStrategy = require('passport-local').Strategy;
const userModel=require("../models/user.js")

var getLogin = (req, res) => {
  //TODO: render login page
  res.render("login",{title:"Login Portal"})
};

var postLogin =async (req, res,next) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  // passport.authenticate('local', {successRedirect: '/',failureRedirect: '/login',failureFlash: true,
  // })(req, res, next);
res.redirect("/books")
};
var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  req.flash('success_msg', 'Logged Out succesfully, visit us soon');
  res.redirect('/login');
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render("register",{title:"Registration_portal"})
};

var postRegister =(req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  userModel.findOne({email :req.body.email})// checking if user already exists
  .then((user)=>{
    if(user){
    
      res.render("register",{title:" Register(User exists)"});
    }
    else{
      const newUser = new userModel({username:req.body.username,email:req.body.email,password:req.body.password});
      newUser.save()
      .then(user => {
       res.redirect('/login');
       })
      .catch(err => console.log(err));}
      
    }) };

      module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

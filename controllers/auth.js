
const passport = require("passport");
const User = require('../models/user');
var getLogin = (req, res) => {
  //TODO: render login page
  if(req.isAuthenticated())
  res.redirect('/');
  else{
    res.render('login',{title: "Login|Page"});
  }
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (err) console.log(err);
    else {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/');
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
  res.render('register', { title: 'Register' });
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  User.register({username: req.body.username,email:req.body.email} ,req.body.password , (err, user)=>{
    if(!err)
    {
      passport.authenticate('local')(req,res,()=>{
      res.redirect('/')})
    }
    else
    {
      res.json(err.message);

    }})
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

const User = require("../models/user");
var passport = require("passport");

var getLogin = (req, res) => {
  //TODO: render login page
  if(req.user){
    res.redirect("/")
  }
  else{
    res.render("login", {title: "login"});
  }
};

// TODO: authenticate using passport
// On successful authentication, redirect to next page
var postLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.redirect("/error");
    }
    if (! user) {
      return res.render("login", {title: "login", msg: "invalid credentials", username: req.body.username, password: req.body.password});
    }
    req.login(user, loginErr => {
      if (loginErr) {
        return res.redirect("/error");
      }
      return res.redirect("/");
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
  if(req.user){
    res.redirect("/")
  }
  else{
    res.render("register", {title: "Register"})
  }
};

var postRegister = (req, res)=>{
    const user=req.body.username,
    pass1=req.body.password,
    pass2=req.body.password2;
    
  if(pass1 != pass2){
    return res.status().render("register", {
      title: "register",
      msg : "passwords dont match",
      username: user,
      password: pass1,
      password2: pass2
    })
  }
  else{
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
        return res.render("register", {
          title: "register",
          msg : "username already exists",
          username: user,
          password: pass1,
          password2: pass2
        })
      }
      passport.authenticate('local')(req, res, function(){
        return res.redirect('/');
      });
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

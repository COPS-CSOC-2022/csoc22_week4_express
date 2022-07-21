const passport = require("passport");
const User = require("../models/user");

var getLogin = (req, res) => {
  //TODO: render login page
  if(req.isAuthenticated()){
    res.redirect("/");
  }
  else {
    res.render("login",{title: "Login"});
  }
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  })

  req.login(user,(err)=>{

    if(!err){
      passport.authenticate("local")(req,res,()=>{
        res.redirect("/");
      })
    }
    else {
      console.log(err);
      res.redirect("/login");
    }  

  })

};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  // console.log(req);
  req.logout((err)=>{
    if(err) {
      console.log(err);
      console.log("Im in if");
    }
   
  });
  res.redirect("/");
  
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render("register",{title: "Register"});
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page

  if(!(req.body.confirm === req.body.password) || !req.body.name){
    console.log("Check the details again!!");
    res.redirect("/register");
  } //for checking confirm password and Name of the user

  User.register({username: req.body.username},req.body.password,(err,newuser)=>{
    if(!err){
      passport.authenticate("local")(req,res,()=>{
        res.redirect("/");
      })
    }
    else {
      console.log(req.body)
      console.log(err);
      res.redirect("/register");
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

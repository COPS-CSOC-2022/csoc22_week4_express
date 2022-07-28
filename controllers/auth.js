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
res.redirect("/books")
};
var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout(function (error) {
    if (error) {return next(error);}
    res.redirect("/");
});
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render("register",{title:"Registration_portal"})
};


    const postRegister = async (req, res, next) => {
//       TODO: Register user to User db using passport
// On successful authentication, redirect to next pag
      try {
        const { username, email, password } = req.body;
        const regiter_user = new userModel({ username, email });
        const registering_User = await userModel.register(regiter_user, password);
        req.login(registering_User, (error) => {
          if (error) return next(error);
          res.redirect("/");
        });
      } catch (error) {
        res.redirect("register");
      }
    };

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

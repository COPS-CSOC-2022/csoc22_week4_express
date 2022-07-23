const { application } = require("express");
const passport = require("passport");
const Book = require("../models/book");
const User = require("../models/user");

var getLogin = (req, res) => {
  //TODO: render login page
  if (!req.isAuthenticated()) {
    res.render("login", { title: "Login" });
  } else {
    res.status(200).redirect("/");
  }
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      res.status(500).render(`Error: ${err}`);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.status(200).redirect("/");
      });
    }
  });
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  try {
    req.logout();
    res.status(200).redirect("/login");
  } catch (err) {
    res.status(500).send("Sorry, some error occurred!");
  }
};

var getRegister = (req, res) => {
  // TODO: render register pages
  res.status(200).render("register", { title: "Register" });
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  try {
    User.register({ username: req.body.username }, req.body.password, (err) => {
      if (!err) {
        passport.authenticate("local")(req, res, () => {
          res.status(200).redirect("/");
        });
      }
    });
  } catch (err) {
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

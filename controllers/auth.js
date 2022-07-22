const User = require("../models/user");

// TODO: render register page
const getRegister = (req, res) => {
  res.render("users/register", { title: "Register" });
};

// TODO: Register user to User db using passport
//On successful authentication, redirect to next page
const postRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to the Library!");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

//TODO: render login page
const getLogin = (req, res) => {
  res.render("users/login", { title: "Login" });
};

// TODO: authenticate using passport
//On successful authentication, redirect to next page
const postLogin = (req, res) => {
  const redirectUrl = "/books";
  req.flash("success", "Welcome Back!");
  res.redirect(redirectUrl);
};

// TODO: write code to logout user and redirect back to the page
const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye! See you Soon");
    res.redirect("/");
  });
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

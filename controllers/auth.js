const mongoose = require("mongoose");
const Book = require("../models/book");
const User = require("../models/user");
const Bookcopy = require("../models/bookCopy");
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
const connectDB = async () => {
  try {
    // mongodb connection string
    var mongoDB =
      "mongodb://monu:monu@cluster0-shard-00-00.fd8mg.mongodb.net:27017,cluster0-shard-00-01.fd8mg.mongodb.net:27017,cluster0-shard-00-02.fd8mg.mongodb.net:27017/?ssl=true&replicaSet=atlas-mu9ebx-shard-0&authSource=admin&retryWrites=true&w=majority";
    const con = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected : ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
connectDB();
var getLogin = (req, res) => {
  //TODO: render login page

  res.render("login", { title: "Login" });
  // req.flash("error", "Test case")
};

var postLogin = (req, res, next) => {
  console.log(req.body.username);
  if (!req.body.username || !req.body.password) {
    req.flash("error", "Empty case");
    console.log("empty");
    return res.render("login", {
      title: "Login",
      errorMessage: "Username or password was not given.",
    });
  }
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log(err);
      return res.render("login", {
        title: "Login",
        errorMessage: "Err.",
      });
    } else {
      if (!user) {
        req.flash("error", "Incorrect case");
        return res.redirect("/login");
      }
      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          console.log("err");
          return res.render("login", {
            title: "Login",
            errorMessage: "Err.",
          });
        } else return res.redirect("/books");
      });
    }
  })(req, res, next);
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  req.flash("error", "Logout");
  res.redirect("/login");
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render("register", { title: "Register" });
};

// Error Handling is still left.
var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
  console.log(req.body.username);
  Users = new User({ username: req.body.username });
  User.register(Users, req.body.password, function (err, user) {
    if (err) {
      // res.redirect("/login");
      if (err == "UserExistsError") {
        console.log("lopo");
        return;
      } else {
        console.log(err);
        console.log("Wrong password or username");
        res.redirect("/register");
      }
    } else {
      passport.authenticate("local")(req, res, () => {
        console.log("Authenticated user.");
        res.redirect("/");
      });
    }
  });
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

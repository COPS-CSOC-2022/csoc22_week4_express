const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require('express-flash');
const session = require('express-session');

// const initializeBooks = require('./utils/initializeBooks');
const initializePassport = require('./config/passport-config');

const storeRoutes = require("./routes/storeRoutes");
const authRoutes = require("./routes/authRoutes");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
var port = process.env.PORT || 3000;

/* Express, session and flash configuration */
app.use(express.static("public"));
app.use(
  session({
    secret: 'decryptionKey',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(express.static(__dirname + '/public'));

/* Passport Configuration */
initializePassport(passport);
app.use(passport.initialize());                           // Middleware that initializes Passport
app.use(passport.session());


/* URL Encoding and EJS Configurations */
app.use(express.urlencoded({ extended: true }));          // Parses incoming URL encoded data from forms to JSON objects
app.set("view engine", "ejs");


/* Middleware to access the logged in user as currentUser in all views */
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


/* Connect to the database  */
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then((result) => {
    console.log("Connected to the database.");
    app.listen(port, () => {
      console.log(`App listening on port ${port}!`);
    });
  })
  .catch((err) => {
    console.log("Connection to database failed.");
    console.log(err);
  });


/* Defining the routes for the app */
app.get("/", (req, res) => {
  res.render("index", {
    title: "Library",
    errorMessage: req.flash('errorMessage'),
    successMessage: req.flash('successMessage')
  });
});
app.use("/books", storeRoutes);
app.use(authRoutes);
// app.use("/initializeBooks", initializeBooks.initializeBooks);

/* A default route added at the last to handle non-existent routes */
app.use((req, res) => {
  res.status(404);
  res.send(`Error 404 : ${req.url} Not Found`);
})
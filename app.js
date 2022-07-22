const express         = require("express");
const app             = express();
const mongoose        = require("mongoose");
const passport        = require("passport");
const auth            = require("./controllers/auth");
const store           = require("./controllers/store");
const User            = require("./models/user");
const localStrategy   = require("passport-local").Strategy;
const middleware      = require("./middleware");
require('dotenv').config();
const port            = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(
  require("express-session")({
    secret: "decryptionkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

const mongooseConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}
mongoose.connect(process.env.MONGO_URI, mongooseConfig, () => {
  console.log("Connected to MongoDB");
})

app.get("/", middleware.isLoggedIn, (req, res) => {
  res.render("index");
});

app.get("/books", middleware.isLoggedIn, store.getAllBooks);

app.get("/book/:id", middleware.isLoggedIn, store.getBook);

app.get("/books/loaned", middleware.isLoggedIn, store.getLoanedBooks);

app.post("/books/issue", middleware.isLoggedIn, store.issueBook);

app.post("/books/return", middleware.isLoggedIn, store.returnBook);

app.post("/books/search-book", middleware.isLoggedIn, store.searchBooks);

app.get("/login", middleware.isLoggedOut, auth.getLogin);

app.post("/login", middleware.isLoggedOut, auth.postLogin);

app.get("/register", middleware.isLoggedOut, auth.getRegister);

app.post("/register", middleware.isLoggedOut, auth.postRegister);

app.get("/logout", middleware.isLoggedIn, auth.logout);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

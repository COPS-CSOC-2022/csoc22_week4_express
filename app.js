const express = require("express");
const app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var auth = require("./controllers/auth");
var store = require("./controllers/store");
var User = require("./models/user");
var localStrategy = require("passport-local");
const flash = require('connect-flash');
const session = require('express-session');
//importing the middleware object to use its functions
var middleware = require("./middleware"); //no need of writing index.js as directory always calls index.js by default
var port = process.env.PORT || 3000;

app.use(express.static("public"));

// passport config
require('./config/passport')(passport)

/*  CONFIGURE WITH PASSPORT */
app.use(
  require("express-session")({
    secret: "decryptionkey", //This is the secret used to sign the session ID cookie.
    resave: false,
    saveUninitialized: false,
  })
);
// Connect flash
app.use(flash());
app.use(passport.initialize()); //middleware that initialises Passport.
app.use(passport.session());
passport.serializeUser(User.serializeUser()); //used to serialize the user for the session
passport.deserializeUser(User.deserializeUser()); // used to deserialize the user

// app.use(expressLayouts);
app.use(express.urlencoded({ extended: true })); //parses incoming url encoded data from forms to json objects
app.set("view engine", "ejs");

//THIS MIDDLEWARE ALLOWS US TO ACCESS THE LOGGED IN USER AS currentUser in all views
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

/* TODO: CONNECT MONGOOSE WITH OUR MONGO DB  */
// DB Config
// const db = require('./config/keys') .mongoURI;

// Connect to MongoDB
mongoose.connect('mongodb+srv://kakashi_2003:papunila@cluster0.5nfwbkv.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Not Connected'));

// Express session 

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


app.get("/", (req, res) => {
  res.render("index", { title: "Kakashi_library" });
});



app.get("/books", store.getAllBooks);

app.get("/book/:id", store.getBook);

app.get("/books/loaned",
  middleware.LoggedIn,//TODO: call a function from middleware object to check if logged in (use the middleware object imported)
  store.getLoanedBooks);

app.post("/books/issue",
  middleware.LoggedIn,//TODO: call a function from middleware object to check if logged in (use the middleware object imported)
  store.issueBook);

app.post("/books/search-book", store.searchBooks);

app.post("/books/books-return", store.returnBooks);

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get("/login", auth.getLogin);

app.post("/login", auth.postLogin);

app.get("/register", auth.getRegister);

app.post("/register", auth.postRegister);


app.get("/logout", auth.logout);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

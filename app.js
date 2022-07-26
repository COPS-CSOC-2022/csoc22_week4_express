const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const auth = require("./controllers/auth");
const store = require("./controllers/store");
const User = require("./models/user");
const localStrategy = require("passport-local");
const dotenv = require('dotenv')
const bodyParser = require( 'body-parser' );
app.use( bodyParser.urlencoded({ extended: true }) );

//importing the middleware object to use its functions
const middleware = require("./middleware"); //no need of writing index.js as directory always calls index.js by default
var port = process.env.PORT || 3000;

app.use(express.static("public"));

require('./config/passport')(passport)

/*  CONFIGURE WITH PASSPORT */
app.use(
  require("express-session")({
    secret: "decryptionkey", //This is the secret used to sign the session ID cookie.
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize()); //middleware that initialises Passport.
app.use(passport.session());
//passport.use(new localStrategy(User.authenticate())); //used to authenticate User model with passport
passport.serializeUser(User.serializeUser()); //used to serialize the user for the session
passport.deserializeUser(User.deserializeUser()); // used to deserialize the user

app.set("view engine", "ejs");

//THIS MIDDLEWARE ALLOWS US TO ACCESS THE LOGGED IN USER AS currentUser in all views
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

/* TODO: CONNECT MONGOOSE WITH OUR MONGO DB  */
dotenv.config()
const dB = process.env.LINK

mongoose.connect(dB, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => {
  console.log("Connected to DB");
  app.listen(port);
})
.catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("index", { title: "Library" });
});

/*-----------------Store ROUTES
TODO: Your task is to complete below controllers in controllers/store.js
If you need to add any new route add it here and define its controller
controllers folder.
*/

app.get("/books", store.getAllBooks);

app.get("/book/:id", store.getBook);

app.get("/books/loaned",
//TODO: call a function from middleware object to check if logged in (use the middleware object imported)
 middleware.isLoggedIn,
 store.getLoanedBooks);

app.post("/books/issue", 
//TODO: call a function from middleware object to check if logged in (use the middleware object imported)
middleware.isLoggedIn,
store.issueBook);

app.post("/books/search-book", store.searchBooks);

/* TODO: WRITE VIEW TO RETURN AN ISSUED BOOK YOURSELF */

app.post("/books/return",

middleware.isLoggedIn,
store.returnBook);


/*-----------------AUTH ROUTES
TODO: Your task is to complete below controllers in controllers/auth.js
If you need to add any new route add it here and define its controller
controllers folder.
*/

app.get("/login", auth.getLogin);

app.post("/login", auth.postLogin);

app.get("/register", auth.getRegister);

app.post("/register", auth.postRegister);

app.get("/logout", auth.logout);

app.get("/loginError", auth.loginError);

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const auth = require("./controllers/auth");
const store = require("./controllers/store");
const User = require("./models/user");
const catchAsync = require("./utils/catchAsync");
const passport = require("passport");
const localStrategy = require("passport-local");
//importing the middleware object to use its functions
const middleware = require("./middleware"); //no need of writing index.js as directory always calls index.js by default
const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL;

const MongoDBStore = require("connect-mongo");

/* TODO: CONNECT MONGOOSE WITH OUR MONGO DB  */
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch((err) => {
    console.log("Mongo Error");
    console.log(err);
  });

// Served public folder
app.use(express.static(path.join(__dirname, "public")));

// Secret for the sessions
const secret = process.env.SECRET || "decryptionkey";

// To store sessions in mongo database
const Mongo_store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

/*  CONFIGURE WITH PASSPORT */
app.use(
  require("express-session")({
    store: Mongo_store,
    name: "session",
    secret, //This is the secret used to sign the session ID cookie.
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(flash()); // to use flash package

app.use(passport.initialize()); //middleware that initialises Passport.
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); //used to authenticate User model with passport

passport.serializeUser(User.serializeUser()); //used to serialize the user for the session
passport.deserializeUser(User.deserializeUser()); // used to deserialize the user

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true })); //parses incoming url encoded data from forms to json objects
app.set("view engine", "ejs");

//THIS MIDDLEWARE ALLOWS US TO ACCESS THE LOGGED IN USER AS currentUser in all views
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("index", { title: "Library" });
});

/*                        Store ROUTES
TODO: Your task is to complete below controllers in controllers/store.js
If you need to add any new route add it here and define its controller
controllers folder.
*/

app.get("/books", catchAsync(store.getAllBooks));

app.get("/book/:id", middleware.isLoggedIn, catchAsync(store.getBook));

//TODO: call a function from middleware object to check if logged in (use the middleware object imported)
app.get("/books/loaned", middleware.isLoggedIn, store.getLoanedBooks);

//TODO: call a function from middleware object to check if logged in (use the middleware object imported)
app.post("/books/issue", middleware.isLoggedIn, store.issueBook);

app.post("/books/search-book", store.searchBooks);

/* TODO: WRITE VIEW TO RETURN AN ISSUED BOOK YOURSELF */
app.post("/return", middleware.isLoggedIn, store.returnBook);

/*-----------------AUTH ROUTES
TODO: Your task is to complete below controllers in controllers/auth.js
If you need to add any new route add it here and define its controller
controllers folder.
*/

app.get("/login", auth.getLogin);

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    failureMessage: true,
    keepSessionInfo: true,
  }),
  auth.postLogin
);

app.get("/register", auth.getRegister);

app.post("/register", catchAsync(auth.postRegister));

app.get("/logout", auth.logout);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

const middlewareObj = {};
//middleware object to check if logged in
middlewareObj.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
  /*
    TODO: Write function to check if user is logged in.
    If user is logged in: Redirect to next page
    else, redirect to login page
    */
};

module.exports = middlewareObj;

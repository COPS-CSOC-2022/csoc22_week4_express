var middlewareObj = {};
//middleware object to check if logged in
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
};

module.exports = middlewareObj;

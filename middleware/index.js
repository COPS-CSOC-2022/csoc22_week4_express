var middlewareObj={};
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user');

//middleware object to check if logged in
middlewareObj.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) 
    {
      return res.redirect("/login");
    }
    next();
}
module.exports=middlewareObj;
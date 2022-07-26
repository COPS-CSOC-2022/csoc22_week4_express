var middlewareObj={};

const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');

const User = require('../models/user');

//middleware object to check if logged in
middlewareObj.userIsLoggedIn=function(req,res,next){
	/*
    TODO: Write function to check if user is logged in.
    If user is logged in: Redirect to next page
    else, redirect to login page
    */

    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/login');
}

middlewareObj.userIsLoggedOut=function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');      
}

module.exports=middlewareObj;
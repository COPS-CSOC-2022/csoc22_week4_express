var middlewareObj = {};

/* Middleware object to check if logged in */
middlewareObj.isLoggedIn = function (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    console.log('User needs to login first. Redirecting to login.....');
    req.flash('errorMessage', 'You first need to be logged in to access this section.');
    res.redirect('/login'); 
}

/* Middleware object to check if logged out */
middlewareObj.isLoggedOut = function (req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    console.log('User needs to logout first. Redirecting back to the original section.....');
    req.flash('errorMessage', 'You first need to logout to access this section.');
    res.redirect('back')
}

module.exports = middlewareObj;
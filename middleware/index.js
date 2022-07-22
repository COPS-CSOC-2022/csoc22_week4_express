let middlewareObj = {};

middlewareObj.isLoggedIn = (req,res,next) => {
   if (req.isAuthenticated()) next()
   else res.redirect('/login')
}

middlewareObj.isLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) res.redirect('/')
    else next()
}

module.exports = middlewareObj;
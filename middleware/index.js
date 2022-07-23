var middlewareObj={};
//middleware object to check if logged in
middlewareObj.isLoggedIn=function(req,res,next){
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
middlewareObj.is_logged_out=function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');      
  }


module.exports=middlewareObj;
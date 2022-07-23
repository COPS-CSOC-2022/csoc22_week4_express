//middleware object to check if logged in
const isLoggedIn=function(req,res,next){
    
	/*
    TODO: Write function to check if user is logged in.
    If user is logged in: Redirect to next page
    else, redirect to login page
    */
   if(req.user) next();
   else
   res.status(200).redirect('/login')
}

module.exports={isLoggedIn};
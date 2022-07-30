const passport = require("passport");
const User = require('../models/user')

var getLogin = (req, res) => {
  //TODO: render login page
  res.render('login' , {title : "Login" ,error:""});
};

var postLogin= (req,res)=>
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
  
{
    passport.authenticate('local', { failureRedirect: '/login' })(req, res, ()=>{
    res.redirect('/');
    })
}

  function logout(req, res) {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  res.redirect("/login");
}

var getRegister = (req, res) => {
  // TODO: render register page
  
  res.render('register' , {title : "Register"});

};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next pag
  if(req.body.username.length==0 || req.body.password.length == 0)
  {
    res.send("Fields cannot be empty");
  }
  User.register(new User({username: req.body.username}),req.body.password,function(err,user){
    if(err){
        console.log(err);
        res.send("Some error occured ! Please try again .");
    }
    passport.authenticate("local")(req,res,()=>{
    res.redirect("/");
})    
})


};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

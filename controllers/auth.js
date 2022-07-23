const path = require('path')
const User  = require('../models/user')

var getLogin = (req, res) => {
  //TODO: render login page
  if(req.isAuthenticated())
    res.redirect('/')
  else{
    res.render('login')
  }
};

var postLogin = async (req, res) => {
  // TODO: authenticate using passport
  // On successful authentication, redirect to next page
  const { user } = await User.authenticate()(req.body.username, req.body.password)
	if (!user) res.redirect('/login')
	else
		req.login(user, err => {
			if (err) res.redirect('/login')
			else res.redirect('/')
	})

};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });

};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render('register')
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  // On successful authentication, redirect to next page
  let name = req.body.name
  let email = req.body.email
  let username = req.body.username
  let password = req.body.password
  console.log(name, email, username, password)
  if(name=='' || email=='' || username =='' || password==''){
    alert("fill all the fields")
    return
  }
  const new_user = {
    username: username,
    password: password,
    loaned_books:[]
  }
  const user = new User(new_user)
  User.register(user, req.body.password, function(err, user) {
    if (err) {
      res.json({success:false, message:"Your account could not be saved. Error: ", err}) 
    }else{
      res.redirect('/login')
    }
  })
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

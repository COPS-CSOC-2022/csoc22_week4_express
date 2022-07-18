var getLogin = (req, res) => {
  //TODO: render login page
  res.render("login", { title: "Login" });
};

var postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
};

var logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
  req.logout();
  res.redirect("/login");
};

var getRegister = (req, res) => {
  // TODO: render register page
  res.render("register", { title: "Register" });
};

var postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister
};

// TODO: render register page
const getRegister = (req, res) => {
  res.render("users/register", { title: "Register" });
};

const postRegister = (req, res) => {
  // TODO: Register user to User db using passport
  //On successful authentication, redirect to next page
};

//TODO: render login page
const getLogin = (req, res) => {
  res.render("users/login", { title: "Login" });
};

const postLogin = (req, res) => {
  // TODO: authenticate using passport
  //On successful authentication, redirect to next page
};

const logout = (req, res) => {
  // TODO: write code to logout user and redirect back to the page
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getRegister,
  postRegister,
};

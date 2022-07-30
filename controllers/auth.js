const passport = require('passport');
var User = require("../models/user");


var getLogin = (req, res) => {
    //TODO: render login 
    res.render("login", { title: "Doraemon LIBRARY" })
};

var postLogin = (req, res, next) => {
    // TODO: authenticate using passport
    //On successful authentication, redirect to next page
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
};

var logout = (req, res) => {
    // TODO: write code to logout user and redirect back to the page
    req.logout();
    req.flash('Haweli', 'bahar nikal bsdk');
    res.redirect('/login');
};

var getRegister = (req, res) => {
    // TODO: render register page
    res.render('register', { title: "Doraemon LIBRARY" });
};

var postRegister = (req, res) => {
    // TODO: Register user to User db using passport
    //On successful authentication, redirect to next page
    let mistakes = [];
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;





    if (password != password2) {
        mistakes.push({ msg: 'password alag hai dubara prayas kre' });
    }
    if (password.length < 4) {
        mistakes.push({ msg: '4 aksahar ka password daal le ' });
    }


    if (mistakes.length !== 0) {
        res.render('register', { mistakes, username, email, password, password2, title: "Doaremon LIBRARY" });

    } else {

        User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    mistakes.push({ msg: 'Email pehle se hai' });
                    res.render('register', { mistakes, username, email, password, password2, title: "Doraemon LIBRARY" });
                } else {
                    const newUser = new User({ username, email, password });
                    newUser.save()
                        .then(user => {
                            req.flash('Haweli', 'aap hweli pr aagye hai');
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                }
            })
    }
};

module.exports = {
    getLogin,
    postLogin,
    logout,
    getRegister,
    postRegister,
};
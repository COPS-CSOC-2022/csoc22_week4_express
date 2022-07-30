var middlewareObj = {};


middlewareObj.LogIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log('pehle ander aaja jaldi');
    req.flash('kota', 'pehle ander aaja fir kitab lena');
    res.redirect('/login');
}


middlewareObj.LogOut = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    console.log('pehle bahar aaja bhai');
    req.flash('kota', 'pehle bahar aaja');
    res.redirect('back')
}

module.exports = middlewareObj;
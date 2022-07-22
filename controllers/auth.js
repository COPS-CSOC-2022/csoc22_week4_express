const User = require('../models/user')

const getLogin = (req, res) => {
	res.render('login')
}

const postLogin = async (req, res) => {
	const { user } = await User.authenticate()(req.body.username, req.body.password)
	if (!user) res.redirect('/login')
	else
		req.login(user, err => {
			if (err) res.redirect('/login')
			else res.redirect('/')
		})
}

const logout = async (req, res) => {
	await req.logout()
	res.redirect('/login')
}

const getRegister = (req, res) => {
	res.render('register')
}

const postRegister = (req, res) => {
	User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, err => {
		if (err) res.redirect('/register')
		else postLogin(req, res)
	})
}

module.exports = {
	getLogin,
	postLogin,
	logout,
	getRegister,
	postRegister,
}

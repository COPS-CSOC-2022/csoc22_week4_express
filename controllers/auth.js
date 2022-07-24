const User = require('../models/user')

const getLogin = (req, res) => {
	res.render('login')
}

const postLogin = async (req, res) => {
	const { user } = await User.authenticate()(req.body.username, req.body.password)
	if (!user) {
		req.flash('error', 'Invalid username or password')
		res.redirect('/login')
	} else {
		req.login(user, err => {
			if (err) res.redirect('/login')
			else res.redirect('/')
		})
	}
}

const logout = async (req, res) => {
	await req.logout()
	res.redirect('/login')
}

const getRegister = (req, res) => {
	res.render('register')
}

const postRegister = async (req, res) => {
	if (await User.exists({username: req.body.username})) {
		req.flash('error', 'Username already exists')
		res.redirect('/register')
	} else if (await User.exists({email: req.body.email})) {
		req.flash('error', 'Email already exists')
		res.redirect('/register')
	} else {
		User.register(new User({ username: req.body.username, email: req.body.email }), req.body.password, err => {
			if (err) {
				req.flash('error', 'Something went wrong')
				res.redirect('/register')
			} else {
				postLogin(req, res)
			}
		})
	}
}

module.exports = {
	getLogin,
	postLogin,
	logout,
	getRegister,
	postRegister,
}

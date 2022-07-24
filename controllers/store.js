const Book = require('../models/book')
const BookCopy = require('../models/bookCopy')
const User = require('../models/user')
const mongoose = require('mongoose')

const setup = async () => {
	await Book.create({
		title: 'Geetanjali',
		genre: 'Poetry',
		author: 'Rabindranath Tagore',
		description: 'Good book',
		rating: 4.8,
		mrp: 900,
	})

	await Book.create({
		title: 'Hamlet',
		genre: 'Drama',
		author: 'William Shakespeare',
		description: 'Nice drama',
		rating: 2.9,
		mrp: 200,
	})

	const books = await Book.find()

	await BookCopy.create({
		book: books[0]._id,
		status: false,
	})
	await BookCopy.create({
		book: books[0]._id,
		status: false,
	})
	await BookCopy.create({
		book: books[0]._id,
		status: false,
	})
	await BookCopy.create({
		book: books[0]._id,
		status: false,
	})
	await BookCopy.create({
		book: books[1]._id,
		status: false,
	})
	await BookCopy.create({
		book: books[1]._id,
		status: false,
	})
	await BookCopy.create({
		book: books[1]._id,
		status: false,
	})
	let bookcopies = await BookCopy.find({ book: books[1]._id })
	bookcopies.forEach(bookc => {
		books[1].available_copies.push(bookc._id)
	})
	bookcopies = await BookCopy.find({ book: books[0]._id })
	bookcopies.forEach(bookc => {
		books[0].available_copies.push(bookc._id)
	})
	await books[0].save()
	await books[1].save()
}

const getAllBooks = async (req, res) => {
	// await setup()
	const books = await Book.find()
	res.render('book_list', { books: books })
}

const getBook = async (req, res) => {
	const book = await Book.findById(req.params.id)
	res.render('book_detail', { book: book, num_available: book.available_copies.length })
}

const getLoanedBooks = async (req, res) => {
	const user = await User.findOne({ username: res.locals.currentUser.username }).populate({ path: 'loaned_books', populate: { path: 'book' } })
	res.render('loaned_books', { books: user.loaned_books })
}

const issueBook = async (req, res) => {
	const user = await User.findOne({ username: res.locals.currentUser.username })
	const book = await Book.findById(req.body.bid)
	const loaned_book_id = book.available_copies.pop()
	await book.save()
	user.loaned_books.push(mongoose.Types.ObjectId(loaned_book_id))
	await user.save()
	const bookInstance = await BookCopy.findById(loaned_book_id)
	bookInstance.status = true
	bookInstance.borrower = user._id
	bookInstance.borrow_date = Date.now()
	await bookInstance.save()
	res.redirect(`/books`)
}

const returnBook = async (req, res) => {
	const user = await User.findOne({ username: res.locals.currentUser.username })
	const bookInstance = await BookCopy.findById(req.body.bid)
	user.loaned_books = user.loaned_books.filter(elem => elem.toString() !== req.body.bid)
	await user.save()
	bookInstance.status = false
	bookInstance.borrower = null
	bookInstance.borrow_date = null
	const book = await Book.findById(bookInstance.book)
	await bookInstance.save()
	book.available_copies.push(mongoose.Types.ObjectId(req.body.bid))
	book.save()
	res.redirect('/books/loaned')
}

const searchBooks = async (req, res) => {
	const books = await Book.find({
		title: { $regex: `.*${req.body.title}.*`, $options: 'i' },
		author: { $regex: `.*${req.body.author}.*`, $options: 'i' },
		genre: { $regex: `.*${req.body.genre}.*`, $options: 'i' },
	})
	res.render('book_list', { books: books })
}

module.exports = {
	getAllBooks,
	getBook,
	getLoanedBooks,
	issueBook,
	returnBook,
	searchBooks,
}

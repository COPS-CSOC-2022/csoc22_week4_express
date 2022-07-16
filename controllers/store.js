const Book = require("../models/book");
const User = require("../models/user");

//TODO: access all books from the book model and render book list page
const getAllBooks = async (req, res) => {
  const books = await Book.find({});
  res.render("book_list", { books, title: books.title });
};

//TODO: access the book with a given id and render book detail page
const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("book_detail", { book, title: book.title });
};

//TODO: access the books loaned for this user and render loaned books page
const getLoanedBooks = (req, res) => {};

// TODO: Extract necessary book details from request
// return with appropriate status
// Optionally redirect to page or display on same
const issueBook = (req, res) => {};

// TODO: extract search details
// query book model on these details
// render page with the above details
const searchBooks = (req, res) => {};

module.exports = {
  getAllBooks,
  getBook,
  getLoanedBooks,
  issueBook,
  searchBooks,
};

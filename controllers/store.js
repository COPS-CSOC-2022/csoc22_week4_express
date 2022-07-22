const Book = require("../models/book");
const User = require("../models/user");
const Book_loan = require("../models/bookCopy");

//TODO: access all books from the book model and render book list page
const getAllBooks = async (req, res) => {
  const books = await Book.find({});
  res.render("book_list", { books, title: "Books" });
};

//TODO: access the book with a given id and render book detail page
const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("book_detail", { book, title: book.title });
};

//TODO: access the books loaned for this user and render loaned books page
const getLoanedBooks = async (req, res) => {
  const books = await Book_loan.find({ borrower: req.user }).populate({
    path: "book",
  });
  res.render("loaned_books", { books, title: "Loaned Book" });
};

// TODO: Extract necessary book details from request
// return with appropriate status
// Optionally redirect to page or display on same
const issueBook = async (req, res) => {
  const book = await Book.findById(req.body.bid);
  const user = await User.findById(req.user._id);
  if (book.available_copies === 0) {
    req.flash("error", "Sorry book not availabe to be issued");
    res.render("book_detail", { book, title: book.title });
  } else {
    const new_loan = new Book_loan();
    new_loan.book = book._id;
    new_loan.status = true;
    new_loan.borrow_date = new Date().toLocaleString();
    new_loan.borrower = user._id;
    user.loaned_books.push(new_loan);
    await user.save();
    await new_loan.save();
    await book.updateOne({ available_copies: book.available_copies - 1 });
    req.flash("success", "Book Issued Successfully");
    res.redirect("/books/loaned");
  }
};

// TODO: extract search details
// query book model on these details
// render page with the above details
const searchBooks = async (req, res) => {
  const book = await Book.findOne({
    $or: [
      { title: req.body.title },
      { author: req.body.author },
      { genre: req.body.genre },
    ],
  });
  if (book) {
    res.render("book_detail", { book: book, title: "Books" });
  } else {
    req.flash("error", "Sorry this book is not available");
    res.redirect("/books");
  }
};

// return book function
const returnBook = async (req, res) => {
  const book = await Book.findById(req.body.returnBookID);
  const user = await User.findById(req.user._id);
  await Book.findByIdAndUpdate(book._id, {
    $set: { available_copies: book.available_copies + 1 },
  });
  await Book_loan.findByIdAndUpdate(req.body.returnBookloanID, {
    $set: { status: true, borrow_date: null, borrower: null },
  });
  await User.findByIdAndUpdate(user._id, {
    $pull: { loaned_books: req.params.id },
  });
  req.flash("success", "Book Returned Successfully");
  res.redirect("/books/loaned");
};

module.exports = {
  getAllBooks,
  getBook,
  getLoanedBooks,
  issueBook,
  searchBooks,
  returnBook,
};

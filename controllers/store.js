const Book = require("../models/book");
const User = require("../models/user");
const Bookcopy = require("../models/bookCopy");
const { default: mongoose } = require("mongoose");

var getAllBooks = async (req, res) => {
  //TODO: access all books from the book model and render book list page
  try {
    const allBooks = await Book.find();
    res
      .status(200)
      .render("book_list", { books: allBooks, title: "Library Books" });
  } catch (err) {
    res.status(500).render("Sorry, some error occurred!");
  }
};

var getBook = async (req, res) => {
  //TODO: access the book with a given id and render book detail page
  const returnBookId = req.params.id;
  try {
    const book = await Book.findById(returnBookId);
    if (book) {
      res
        .status(200)
        .render("book_detail", { book: book, title: "Books | " + book.title });
    } else res.status(404).send("No such book");
  } catch (err) {
    res.status(500).send("Sorry, some error occurred!");
  }
};

var getLoanedBooks = (req, res) => {
  //TODO: access the books loaned for this user and render loaned books page
  User.findOne({ username: req.user.username }, function (err, user) {
    if (!err) {
      if (user) {
        Bookcopy.find({ borrower: user._id })
          .populate("book")
          .populate("borrower")
          .exec((err, userBooks) => {
            if (!err) {
              if (userBooks) {
                res.status(200).render("loaned_books", {
                  books: userBooks,
                  title: "Books Loaned",
                });
              }
            }
          });
      }
    }
  });
};

var issueBook = (req, res) => {
  // TODO: Extract necessary book details from request
  // return with appropriate status
  // Optionally redirect to page or display on same
  Book.findOne({ _id: req.body.bid }, function (err, bookFound) {
    if (!err) {
      if (bookFound) {
        if (bookFound.available_copies) {
          var quantity = bookFound.available_copies - 1;
          Book.updateOne(
            { _id: req.body.bid },
            { available_copies: quantity },
            (err) => {
              if (err) res.status(500).render(`Error: ${err}`);
            }
          );

          let isAvailable = quantity ? true : false;
          const issuedBook = new Bookcopy({
            book: bookFound._id,
            status: isAvailable,
            borrower: req.user._id,
          });
          issuedBook.save();
          User.findOneAndUpdate(
            { username: req.user.username },
            { $push: { loaned_books: issuedBook } },
            { safe: true, upsert: true, new: true },
            (err, found) => {
              if (err) res.status(500).render(`Error: ${err}`);
            }
          );

          Bookcopy.update(
            { book: bookFound },
            { status: isAvailable },
            (err) => {
              res.status(500).render(`Error: ${err}`);
            }
          );
          res.status(200).redirect("/books/loaned");
        } else {
          res.send("No copy of the book available to loan!");
        }
      }
    }
  });
};

var searchBooks = async (req, res) => {
  // TODO: extract search details
  // query book model on these details
  // render page with the above details

  const matchingBooks = await Book.find(
    // { title: req.body.title, author: req.body.author, genre: req.body.genre },
    {
      title: { $regex: `.*${req.body.title}.*`, $options: "i" },
      author: { $regex: `.*${req.body.author}.*`, $options: "i" },
      genre: { $regex: `.*${req.body.genre}.*`, $options: "i" },
    }
  );

  res.render("book_list", { books: matchingBooks });
};

var returnBook = (req, res) => {
  const returnBookId = req.body.bid;

  Book.findById(returnBookId).then((book) => {
    if (book) {
      new_available_copies = book.available_copies + 1;
      Book.updateOne(
        { _id: returnBookId },
        { available_copies: new_available_copies },
        (err) => {
          if (err) res.status(500).render(`Error: ${err}`);
        }
      );
      Bookcopy.findOneAndDelete({ book: book }).then((foundBook) => {
        User.findOneAndUpdate(
          { username: req.user.username },
          { $pull: { loaned_books: foundBook._id } },
          (err) => {
            if (err) res.status(500).render(`Error: ${err}`);
          }
        );
      });
      Bookcopy.updateOne({ book: book }, { status: true }, (err) => {
        res.status(500).render(`Error: ${err}`);
      });
      res.redirect("/books/loaned");
    } else {
      console.log("Sorry, some error occurred!");
    }
  });
};

module.exports = {
  getAllBooks,
  getBook,
  getLoanedBooks,
  issueBook,
  returnBook,
  searchBooks,
};

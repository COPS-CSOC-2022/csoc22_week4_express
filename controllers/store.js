const mongoose = require("mongoose");
const Book = require("../models/book");
const User = require("../models/user");
const BookCopy = require("../models/bookCopy");
const { DateTime } = require("luxon"); //for date handling

const connectDB = async () => {
  try {
    // mongodb connection string
    var mongoDB =
      "mongodb://monu:monu@cluster0-shard-00-00.fd8mg.mongodb.net:27017,cluster0-shard-00-01.fd8mg.mongodb.net:27017,cluster0-shard-00-02.fd8mg.mongodb.net:27017/?ssl=true&replicaSet=atlas-mu9ebx-shard-0&authSource=admin&retryWrites=true&w=majority";
    const con = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log(`MongoDB connected : ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
connectDB();
var getAllBooks = async (req, res) => {
  //TODO: access all books from the book model and render book list page
  const books = await Book.find();
  res.render("book_list", { books, title: "Books | Library" });
};

var getBook = async (req, res) => {
  //TODO: access the book with a given id and render book detail page
  var id = req.params.id;
  const book = await Book.findById(id);
  res.render("book_detail", { book, title: "Book Details" });
};

var getLoanedBooks = async (req, res) => {
  //TODO: access the books loaned for this user and render loaned books page
  // console.log(req.user.id);
  // var userid=req.user.id;
  // User.findById(userid)
  //     .populate("loaned_books")
  //     .then(user =>{
  //       res.json(user)
  //     })
  var userId = req.user.id;
  BookCopy.find({ borrower: mongoose.Types.ObjectId(userId), status: false })
    .populate("book")
    .then((data) => {
      res.render("loaned_books", {
        books: data,
        title: "Book Loaned by a particular user",
      });
    })
    .catch((err) => console.log(err.message));
  // res.render("loaned_books", {title: "Book Loaned by a particular user" });
};

var issueBook = async (req, res) => {
  var userId = req.user.id;
  Book.findById(mongoose.Types.ObjectId(req.body.bid))
    .then((book) => {
      Book.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.bid), {
        available_copies: book.available_copies - 1,
      }).then((res) => console.log("Books available changed. "));
    })
    .catch((err) => console.log(err.message));

  BookCopy.find(
    {
      book: mongoose.Types.ObjectId(req.body.bid),
      status: true,
    },
    function (err, copies) {
      var bookCopyId;
      if (copies.length == 0) {
        var newBookCopy = new BookCopy({
          book: req.body.bid,
          status: false,
          borrower: mongoose.Types.ObjectId(userId),
        });
        newBookCopy
          .save()
          .then((res) => {
            bookCopyId = res._id;
          })
          .catch((err) => console.log(err.message));
      } else {
        var newBookCopy = copies[0];
        bookCopyId = newBookCopy._id;
        BookCopy.findByIdAndUpdate(mongoose.Types.ObjectId(bookCopyId), {
          status: false,
          borrower: mongoose.Types.ObjectId(userId),
          borrow_date: DateTime.now().toLocaleString(),
        });
      }
      User.findByIdAndUpdate(mongoose.Types.ObjectId(userId), {
        $push: { loaned_books: mongoose.Types.ObjectId(bookCopyId) },
      })
        .then((res) => console.log("Done"))
        .catch((err) => console.log(err.message));
    }
  );
  res.redirect("/books/loaned");
};

var searchBooks = async (req, res) => {
  // TODO: extract search details
  // query book model on these details
  // render page with the above details
  const query = req.body;
  if (!query.title) {
    console.log("Empty search");
    // const books = await Book.find();
    // res.render("book_list", { books, title: "Books | Library" });
    // return;
  }
  const result = await Book.find({
    title: new RegExp(query.title),
    author: new RegExp(query.author),
    genre: new RegExp(query.genre),
  });
  res.render("book_list", { books: result, title: "Books | Library" });

  //  res.json({
  //   errno: 0,
  //   data: result
  //  })
  // res.json(query);
};

var returnBooks = (req, res) => {
  BookCopy.findById(req.body.bcid, (err, bookCopy) => {
    let bookId = bookCopy.book;
    bookCopy.status = true;
    bookCopy.borrower = null;
    bookCopy
      .save()
      .then((res) => console.log("Book copy returned. "));
    User.findByIdAndUpdate(mongoose.Types.ObjectId(req.user.id), {
      $pull: {
        loaned_books: mongoose.Types.ObjectId(req.body.bcid),
      },
    })
      .then((res) => console.log("User information updated. "))
      .catch((err) => console.log(err.message));

    Book.findByIdAndUpdate(mongoose.Types.ObjectId(bookId), {
      $inc: { available_copies: 1 },
      // available_copies: available_copies + 1,
    })
      .then((res) => console.log("Book count updated. "))
      .catch((err) => console.log(err.message));
    res.redirect("/books/loaned");
  });
};

module.exports = {
  getAllBooks,
  getBook,
  getLoanedBooks,
  issueBook,
  searchBooks,
  returnBooks,
};

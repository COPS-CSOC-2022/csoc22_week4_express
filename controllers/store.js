const mongoose = require('mongoose');
const Book = require("../models/book");
const User = require("../models/user");
const Bookcopy = require("../models/bookCopy");

const connectDB = async () => {
  try {
    // mongodb connection string

    var mongoDB =
      "mongodb://monu:monu@cluster0-shard-00-00.fd8mg.mongodb.net:27017,cluster0-shard-00-01.fd8mg.mongodb.net:27017,cluster0-shard-00-02.fd8mg.mongodb.net:27017/?ssl=true&replicaSet=atlas-mu9ebx-shard-0&authSource=admin&retryWrites=true&w=majority";

    const con = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected : ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
connectDB();
var getAllBooks =async(req, res)=>{
  //TODO: access all books from the book model and render book list page
  const books = await Book.find();
  res.render("book_list", { books, title: "Books | Library" });
};

var getBook =async (req, res) => {
  //TODO: access the book with a given id and render book detail page
  var id=req.params.id;
  const book = await Book.findById(id);
  res.render("book_detail", { book, title: "Book Details" });
};

var getLoanedBooks = (req, res) => {
  //TODO: access the books loaned for this user and render loaned books page
};

var issueBook = (req, res) => {
  // TODO: Extract necessary book details from request
  // return with appropriate status
  // Optionally redirect to page or display on same
};

var searchBooks = (req, res) => {
  // TODO: extract search details
  // query book model on these details
  // render page with the above details
};

module.exports = {
  getAllBooks,
  getBook,
  getLoanedBooks,
  issueBook,
  searchBooks
};

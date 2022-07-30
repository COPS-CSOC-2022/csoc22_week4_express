const Book = require("../models/book");
const User = require("../models/user");
const BookCopy = require("../models/bookCopy");
const mongoose = require("mongoose");


var getAllBooks = (req, res) => {
    Book.find({})
        .then((cooks) => {
            res.render("book_list", {
                books: cooks,
                title: "Doraemon| Library",
            });
        })
        .catch((err) => {
            console.log("nikal ab");
        });
};

var getBook = (req, res) => {
    Book.findById(req.params.id)
        .then((dora_dora) => {
            res.render("book_detail", {
                book: dora_dora,
                title: "Book Details",
            });
        })
        .catch((err) => {
            console.log("nikal ab");
        });
};

var getLoanedBooks = (req, res) => {
    User.findOne({ username: req.user.username })
        .then((user) => {
            BookCopy.find({ borrower: user._id })
                .populate('book')
                .populate('borrower')
                .then((foundBooks) => {
                    res.render('loaned_books', { books: foundBooks, title: "Loans" });
                })
        })
};

var issueBook = (req, res) => {


    mongoose.set('useFindAndModify', false);
    Book.findById(req.body.bid)
        .then((foundBook) => {
            if (foundBook !== null) {
                if (foundBook) {
                    if (foundBook.available_copies) {
                        const num = foundBook.available_copies - 1;
                        Book.updateOne({ _id: req.body.bid }, { available_copies: num },
                            (err) => { if (err) console.log(err) }
                        );


                        let availability_of_book = (num) ? true : false;


                        const book_issued = new BookCopy({
                            book: foundBook._id,
                            status: availability_of_book,
                            borrow_data: new Date(),
                            borrower: req.user._id
                        });
                        book_issued.save();
                        User.findOneAndUpdate({ username: req.user.username }, { $push: { loaned_books: book_issued } },
                            (err) => {
                                if (err)
                                    console.log(err);
                            });
                        BookCopy.updateOne({ book: foundBook }, { status: availability_of_book }, (err) => { console.log(err) });
                        res.redirect('/books/loaned');
                    } else {
                        console.log("")
                    }
                }
            }
        });
};

var searchBooks = (req, res) => {


    Book.findOne({ title: req.body.title, author: req.body.author, genre: req.body.genre }, (err, book) => {
        if (!err) {
            if (book !== null) {
                res.render("book_detail", { book: book, title: "Library" });
            } else {
                console.log("")
            }
        } else {
            console.log("")
        }
    });
};


module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks
};
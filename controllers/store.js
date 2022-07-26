const Book = require("../models/book");
const User = require("../models/user");
const BookCopy = require("../models/bookCopy");
const mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var getAllBooks = (req, res) => {
    Book.find()
        .then((books) => {
            res.render("book_list", {
                books,
                title: "Books | Library"
            });
        })
        .catch((err) => {
            console.log(err);
        })
}

var getBook = (req, res) => {
    var id = req.params.id;
    Book.findById(id)
        .then((foundBook) => {
            res.render("book_detail", {
                book: foundBook,
                title: "Book Details"
            });
        })
        .catch((err) => {
            console.log(err);
        })
}

var getLoanedBooks = async (req, res) => {
    let userId = req.user.id;
    BookCopy.find({
        borrower: mongoose.Types.ObjectId(userId),
        status: false
    })
        .populate('book')
        .then(data => {
            res.render("loaned_books", {
                books: data,
                title: "Books | Library",
                errorMessage: req.flash('errorMessage'),
                successMessage: req.flash('successMessage')
            });
        })
}

var issueBook = (req, res) => {
    var bookId = req.body.bookId;
    var userId = req.user.id;

    Book.findById(ObjectId(bookId))
        .then((book) => {
            var availableCopies = Number(book.available_copies);
            if (availableCopies == 0) {
                req.flash('errorMessage', 'All the copies of this book have currently been borrowed. Please check back later.');
                return res.redirect('/books/' + bookId);
            }

            Book.findByIdAndUpdate(ObjectId(bookId), {
                available_copies: availableCopies - 1
            })
                .then(res => console.log("Book available copies updated. "))
                .catch(err => console.log(err.message))
        })
        .catch(err => console.log(err.message));

    BookCopy.find({
        book: ObjectId(bookId),
        status: true
    }, function (err, copies) {
        if (err) console.log(err.message);
        else {
            var bookCopyId;
            if (copies.length == 0) {
                var newBookCopy = new BookCopy({
                    book: bookId,
                    status: false,
                    borrower: ObjectId(userId)
                });
                newBookCopy.save()
                    .then((res) => {
                        // console.log(res);
                        bookCopyId = res._id;
                        console.log("New book copy created. ");
                        console.log("Book copy information updated successfully. ");
                    })
                    .catch(err => console.log(err.message))
            }
            else {
                var newBookCopy = copies[0];
                bookCopyId = newBookCopy._id;
                BookCopy.findByIdAndUpdate(ObjectId(bookCopyId), {
                    status: false,
                    borrower: ObjectId(userId),
                    borrow_date: Date.now()
                })
                    .then(res => console.log("Old book copy updated. \nBook copy information updated successfully. "))
                    .catch(err => console.log(err.message));
            }

            User.findByIdAndUpdate(ObjectId(userId), {
                $push: { loaned_books: ObjectId(bookCopyId) }
            })
                .then(res => {
                    console.log("User information updated successfully. ");
                })
                .catch(err => console.log(err.message));
        }
    }).then(_ => {
        req.flash('successMessage', 'The book has been successfully issued to you.');
        res.redirect('/books/loaned');
    })
}

var searchBooks = (req, res) => {
    queryData = req.body;
    Book.find({
        title: { "$regex": queryData.title, "$options": "i" },
        author: { "$regex": queryData.author, "$options": "i" },
        genreString: { "$regex": queryData.genre, "$options": "i" },
    })
        .then(data => {
            res.render("book_list", {
                books: data,
                title: "Books | Library"
            });
        })
        .catch(err => console.log(err));
}

var returnBook = (req, res) => {
    try {
        BookCopy.findById(req.body.bookCopyId, (err, bookCopy) => {
            if (err) throw err;
            if (bookCopy.status) res.send('Book was already Returned');
            else {
                let bookId = bookCopy.book;

                bookCopy.status = true;
                bookCopy.borrower = null;
                bookCopy.save()
                    .then((_) => console.log('Book copy returned to the library. '))
                    .catch(err => console.log(err.message))

                User.findByIdAndUpdate(ObjectId(req.user.id), {
                    $pull: {
                        loaned_books: ObjectId(req.body.bookCopyId)
                    }
                })
                    .then((_) => console.log('User information updated. '))
                    .catch((err) => console.log(err.message));

                Book.findByIdAndUpdate(ObjectId(bookId), {
                    $inc: { available_copies: 1 }
                })
                    .then((_) => console.log('Book count updated. '))
                    .catch((err) => console.log(err.message));

                req.flash('successMessage', 'The book has been successfully returned. ');
                res.redirect('/books/loaned');
            }
        });
    } catch {
        req.flash('errorMessage', 'The return operation should not be performed. \n Try again later.')
        res.redirect('/books/loaned');
    }
}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks,
    returnBook
}
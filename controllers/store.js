var Book = require("../models/book");
var Bookcopy = require("../models/bookCopy");
var mongoose = require("mongoose");
var User = require("../models/user");


var getAllBooks = (req, res) => {
    Book.find({})
        .then((booklist) => {
            res.render("book_list", { books: booklist, title: "Books_kakashi" });
        })
        .catch(() => {
            console.log("No books found...");
        })

}

var getBook = (req, res) => {
    console.log(req)
    Book.findById(req.params.id)
        .then((spec_book) => {
            // console.log(spec_book)
            res.render("book_detail", { book: spec_book, title: "Books_kakashi" });
        })
        .catch(() => {
            console.log("Book could not be retrived..");
        })

}

var getLoanedBooks = (req, res) => {

    User.findOne({ username: req.user.username })
        .then((person) => {
            const personId = person._id
            Bookcopy.find({ borrower: personId })
                .populate('book')
                .populate('borrower')
                .then((personLoanBooks) => {
                    res.render('loaned_books', { books: personLoanBooks, title: "Loans" });
                }
                )
        })



}

var issueBook = (req, res) => {


    mongoose.set('useFindAndModify', false);
    Book.findById(req.body.bid)
        .then((specificbook) => {
            if (specificbook !== null) {
                if (specificbook) {
                    if (specificbook.available_copies) {
                        var availablebooks = specificbook.available_copies
                        Book.updateOne(
                            { _id: req.body.bid },
                            { available_copies: availablebooks - 1 },
                            (err) => { console.log("Book could not be updated...") }
                        );


                        let avail_book = true
                        if (availablebooks - 1 == 0) avail_book = false


                        const Isu_book = new Bookcopy({
                            book: req.body.bid,
                            status: avail_book,
                            borrow_data: new Date(),
                            borrower: req.user._id
                        });
                        Isu_book.save();
                        User.findOneAndUpdate({ username: req.user.username }, { $push: { loaned_books: Isu_book } },
                            (err) => {
                                if (err)
                                    console.log("Book could not be found....");
                            });


                        Bookcopy.updateOne({ book: specificbook }, { status: avail_book }, (err) => { console.log("The book couldnot be updated....") });

                        res.redirect('/books/loaned');
                    } else {
                        console.log("The book could not be found...")
                    }
                }
            }
        });



}

var returnBooks = (req, res) => {
    mongoose.set('useFindAndModify', false);
    Book.findById(req.body.bid)
        .then((specificBook) => {
            if (specificBook !== null) {
                if (specificBook) {
                    var avail_book = specificBook.available_copies
                    Book.updateOne(
                        { _id: req.body.bid },
                        { available_copies: avail_book + 1 },
                        (err) => { if (err) console.log("Book couldnot found....") }
                    );
                    Bookcopy.findOneAndDelete({ book: specificBook })
                        .then((bookFound) => {
                            User.findOneAndUpdate({ username: req.user.username },
                                { $pull: { loaned_books: bookFound._id } },
                                (err) => {
                                    if (err)
                                        console.log("Book couldnot be found....");
                                });
                        });
                    Bookcopy.updateOne({ book: specificBook }, { status: true }, (err) => { console.log("Book could not be updated....") });
                    res.redirect('/books/loaned');
                } else {
                    console.log("No Such book exist to return")
                }
            }
        });
}


var searchBooks = (req, res) => {
    Book.findOne({ title: req.body.title, author: req.body.author, genre: req.body.genre }, (err, book) => {
        if (!err) {
            if (book !== null) {
                res.render("book_detail", { book: book, title: "Kakashi_Library" });
            }
            else {
                console.log("The book couldnot be found according to that specifics...")
            }
        }
        else {
            console.log("No such book could be found....")
        }
    })
}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks,
    returnBooks
}
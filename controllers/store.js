const book = require("../models/book");
const bookCopy = require("../models/bookCopy");
const user = require("../models/user");

var getAllBooks = (req, res) => {

    //TODO: access all books from the book model and render book list page

    book.find({}, (err, result) => {

        if(err) {
            console.log(err);
        }
        else {
            res.render("book_list", {books: result, title: "Books | Library"});
        }
    })
}

var getBook = (req, res) => {

    //TODO: access the book with a given id and render book detail page

    book.findOne({ _id: req.params.id }, (err, result) => {

        if(err) {
            console.log(err);
        }
        else {
            if(result) {
                res.render("book_detail", {book: result, title: "Book | " + result.title});
            }
            else {
                res.render("No such book found!");
            }
        }
    })
}

var getLoanedBooks = (req, res) => {

    //TODO: access the books loaned for this user and render loaned books page

    user.findOne({ username: req.user.username }, (err, result) => {
        if(err) {
            console.log(err);
        }
        else {
            if(result) {
                bookCopy.find({ borrower: result._id})
                .populate('book')
                .populate('borrower')
                .exec((err, loanedBooks) => {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        res.render("loaned_books", {books: loanedBooks, title: "Loaned Books"});
                    }
                })
            }
        }
    })
}

var issueBook = (req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same

    book.findOne({ _id: req.body.bid }, (err, foundBook) => {

        if(err) {
            console.log(err);
        }
        else {
            if(!foundBook) {
                res.send("The book is unavailable!");
            }
            else {
                
                let quantity = foundBook.available_copies;
                if(quantity) {

                    quantity = quantity-1;
                    book.updateOne(
                        { _id: req.body.bid },
                        { available_copies: quantity },
                        (err) => {
                            if(err) {
                                console.log(err);
                            }
                        }
                    )
                }

                let available = false;
                if(quantity) {
                    available = true;
                }

                const issuedBook = new bookCopy({
                    book: foundBook._id,
                    status: available,
                    borrow_data: Date.now(),
                    borrower: req.user._id
                });
                issuedBook.save();

                user.findOneAndUpdate({ username: req.user.username }, 
                    {$push: {loaned_books: issuedBook}}, 
                    {safe: true, upsert: true, new: true},
                    (err, found) => {

                    if(err) {
                        console.log(err);
                    }
                });

                bookCopy.update(
                    { book: foundBook },
                    { status: available },
                    { boorow_date: Date.now() },
                    (err) => {
                        if(err) {
                            console.log(err);
                        }
                    }
                );
                res.redirect('/books/loaned');
            }
        }
    })
}

var returnBook = (req, res) => {


    bookCopy.findOne({ _id: req.body.bid})
    .populate('book')
    .exec((err, found) => {
        if(err) {
            console.log(err);
        }
        else {
            let available = found.book.available_copies;
            book.findByIdAndUpdate( found.book, 
                {$set: {available_copies: available + 1}}, 
                (err, result) => {
                if(err) {
                    console.log(err);
                }
            });
            user.findByIdAndUpdate({ _id: req.user._id},  
                {$pull: {loaned_books: found._id}}, 
                (err, result) => {
                if(err) {
                    console.log(err);
                }
            });
            bookCopy.findByIdAndUpdate({ _id: found._id }, 
                {$set: {status: true, borrower: null, borrow_date: null}}, 
                (err, result) => {
                if(err) {
                    console.log(err);
                }
            });
            res.redirect('/books/loaned');
        }
    })

}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    
    book.findOne({title: req.body.title, author: req.body.author, genre: req.body.genre}, 
        (err, result) => {

        if(err) {
            console.log(err);
        }
        else {
            if(result) {
                res.redirect('/book/' + result._id);
            }
            else {
                res.send("No such book found!");
            }
        }
    })
}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks,
    returnBook
}

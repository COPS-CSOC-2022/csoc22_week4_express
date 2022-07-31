const Book = require('../models/book');
const bookCopy = require('../models/bookCopy');
const User = require('../models/user');

var getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page
    Book.find()
    .then((result) => {
        res.render("book_list", { books: result, title: "Books | Library" });
    })
    .catch((err) => 
    console.log(err));
}

var getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    const id = req.params.id;
    Book.findById(id)
        .then((result) => {
            res.render('book_detail', {book: result, title: 'Book Details', num_available: result.available_copies});
        })
        .catch((err) => 
        console.log(err));
}

var getLoanedBooks = (req, res) => {
    //TODO: access the books loaned for this user and render loaned books page
    User.findOne({username: req.user.username}, (err, found) => {
        if (!err && found) {
            bookCopy.find({borrower: found._id})
            .populate('book')
            .populate('borrower')
            .exec((err, foundbooks) => {
                if (err) console.log(err);
                else {
                    res.render('loaned_books', {books: foundbooks, title: 'Loaned Books'});
                }
            })
        }
    })
}

var issueBook = (req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    console.log(req.body);
    bookCopy.findOne({book: req.body.bid, status: true}).populate('book').exec((err, foundbook) => {
        console.log(foundbook);
        if (err) console.log(err);
        else if (!foundbook) {res.send('No Copy Available :\')')}
        else {
            var available = foundbook.book.available_copies;
            console.log(available);
            if (available >= 1) {
                console.log(foundbook);
                User.findOneAndUpdate(
                    {username: req.user.username},
                    {$push: {loaned_books: foundbook.book}},
                    (err, founduser) => {
                        if (err) console.log(err);
                        else {
                            console.log('gasd');
                            console.log(foundbook._id);
                            bookCopy.findByIdAndUpdate(foundbook._id, {$set: {status: false, borrower: founduser._id, borrow_date: new Date()}}, (err, found) => {if (err) console.log(err)});
                            Book.findByIdAndUpdate(foundbook.book._id, {$set: {available_copies: available-1}}, (err, found) => {if (err) console.log(err)});
                        }
                    }
                );

                res.redirect('/books');

            }
            else {
                res.send('Currently book is not avaliable');
            }
        }
    })
    // console.log(req.body);
}

var returnBook = (req, res) => {
    bookCopy.findOne({_id: req.body.bid}).populate('book').exec((err, foundBookCopy) => {
        if (err) console.log(err);
        else {
            var available = foundBookCopy.book.available_copies;
            Book.findByIdAndUpdate(foundBookCopy.book, {$set: {available_copies: available + 1}}, (err, found) => {if (err) console.log(err)});
            User.findByIdAndUpdate(req.user._id, {$pull: {loaned_books: foundBookCopy._id}}, (err, found) => {if (err) console.log(err)});
            bookCopy.findByIdAndUpdate(foundBookCopy._id, {$set: {status: true, borrower: null, borrow_date: null}}, (err, found) => {if (err) console.log(err)});
            res.redirect('/books/loaned');
        }
    })

}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    console.log(req.body);
    Book.findOne({title: req.body.title, author: req.body.author, genre: req.body.genre}, (err, found) => {
        if (err) console.log(err);
        else if (!found) res.send('No such book available :\')');
        else {
            res.status(200).render('book_list', {books: [found], title: 'Book | Search'});
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
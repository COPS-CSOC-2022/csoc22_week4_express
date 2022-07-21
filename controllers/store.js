const { trusted } = require('mongoose');
const Book = require('../models/book');
const Bookcopy = require('../models/bookcopy');
const User = require('../models/user');

var getAllBooks = async (req, res) => {
    //TODO: access all books from the book model and render book list page
    try{const allBooks = await Book.find({});
    res.status(200).render("book_list", { books: allBooks, title: "Books | Library" });}
    catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
      }
}

var getBook = async (req, res) => {
    //TODO: access the book with a given id and render book detail page
    try {
        const book = await Book.findById(req.params.id);
        if (book) res.status(200).render("book_detail", { book: book, title: "Books | " + book.title});
        else res.status(404).send("No such book");
    } catch (err) { res.status(500).send("Internal Server Error"); console.log(err); }

}

var getLoanedBooks = async (req, res) => {

    //TODO: access the books loaned for this user and render loaned books page
    try {
        const loaned_books = await Bookcopy.find({borrower:req.user}).populate('book');
            res.status(200).render('loaned_books',{books:loaned_books,title:"Books | Loaned"});
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}

var issueBook = async (req, res) => {

    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    try {
        const book = await Book.findById(req.body.bid)
        const user = await User.findById(req.user);
        if (book && user && book.available_copies > 0) {
            const bookcopy = await Bookcopy.findOne({ book: book._id, status: true });
            var new_available_copies = book.available_copies - 1;
            await User.findByIdAndUpdate(user._id, { $push: { loaned_books: bookcopy._id } })
            await Bookcopy.findByIdAndUpdate(bookcopy._id, { $set: { status: false, borrow_data: Date.now(), borrower: user._id } })
            await Book.findByIdAndUpdate(book._id, { $set: { available_copies: new_available_copies } })
            res.status(200).redirect("/books/loaned")
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
        console.log(e);
    }
}

var searchBooks = async (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    try {
        const book = await Book.findOne({ title: req.body.title, author: req.body.author, genre: req.body.genre })
        if (book) { res.status(200).render("book_detail",{book:book,title:"Books | " + book.title}) }
        else { res.status(404).send("No such Book") }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}

var returnBook = async (req, res) => {
    try {
        const bookcopy = await Bookcopy.findById(req.params.id);
        const user = await User.findById(req.user);

        if (bookcopy && !bookcopy.status && user && user.loaned_books.includes(req.params.id)) {
            const book = await Book.findById(bookcopy.book);
            var new_available_copies = book.available_copies + 1;
            await Book.findByIdAndUpdate(book._id, { $set: { available_copies: new_available_copies } });
            await Bookcopy.findByIdAndUpdate(req.params.id, { $set: { status: true, borrow_data: null, borrower: null } });
            await User.findByIdAndUpdate(user._id, { $pull: { loaned_books: req.params.id } });
            res.status(200).redirect("/books/loaned")            
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
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
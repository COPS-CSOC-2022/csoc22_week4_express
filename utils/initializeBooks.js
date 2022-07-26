const BookList = require('../data/books');
const Book = require('../models/book');

function initializeBooks(req, res) {
    BookList.books.forEach(book => {
        console.log(book);
        var newBook = new Book(book);
        newBook.save()
            .then(result => {
                console.log("Saved book successfully");
            })
            .catch(err => {
                console.log("Error : ", err.message);
            })
    });
    res.redirect('/');
}

module.exports = { initializeBooks } 
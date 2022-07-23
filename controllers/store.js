var Book = require("../models/book");
var User = require("../models/user");
var Bookcopy = require('../models/bookCopy')

var getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page
    Book.find({}, function(err, allBooks) {
        res.render("book_list", { books: allBooks, title: "BOOKS" });    
    });
}

async function findByID(id){
    return await Book.findById(id)
}

var getBook = async (req, res) => {
    //TODO: access the book with a given id and render book detail page
    let book = await Book.findById(req.params.id)
    console.log(book)
    res.render('book_detail', { book: book , title:"Books | Library" })
}

var getLoanedBooks = (req, res) => {

    //TODO: access the books loaned for this user and render loaned books page
    User.findOne({}, function (error, user) {
        Bookcopy.find({borrower: user.id})
        .populate('book')
        .populate('borrower')
        .exec(function (err, loaned_books) {
            if(err) return
            console.log(loaned_books)
            res.render('loaned_books', { books: loaned_books, title:"Loaned books" })
        })
    })
        
    
}

var issueBook = async (req, res) => {

    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    

    let id = req.params.id
    
    let check1 = await Book.findById(id).available_copies == 0  
    console.log(id)
    User.findOne({}, async function(err, user){

        const book = await findByID(id)
        const bcpy = {
            book: id, //embed reference to id of book of which its a copy
            status: true,//TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE 
            borrow_date: Date.now(),//date when book was borrowed
            borrower: user.id
        }
        
        console.log(user)

        if( user.loaned_books.includes(id) ||  check1){
            // err
            console.log("not available or already issued!")
            res.status(400)
            res.send("not available or already issued!")
            return
        }

        console.log(book)
        res.status(200)
        
        book.available_copies--;
        await book.save()
        user.loaned_books.push(book.id)
        await user.save()

        const cpy = new Bookcopy(bcpy)
        await cpy.save()

        res.redirect(`/books/loaned`)

    })
}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    let searchQuery = {
        title: req.body.title, 
    }

    Book.find(searchQuery, function(err, responses){
        res.render('book_list', { books: responses, title: req.body.title })
    })

}

var returnBook = async (req, res) => {

    let bookCopyId = req.params.id
    console.log("bookcopy id: ", bookCopyId)
    let bookCopy = await Bookcopy.findById(bookCopyId)
    let book = await Book.findById(bookCopy.book)
    book.available_copies++
    
    User.findOne({}, async function(err, user){
        user.loaned_books = user.loaned_books.filter(e => e != book.id)
        await user.save()
    })

    await Bookcopy.deleteOne({_id: bookCopyId})

    await book.save()
    res.redirect('/books/loaned')
}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks,
    returnBook
}
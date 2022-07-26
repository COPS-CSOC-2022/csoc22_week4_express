var Book = require("../models/book.js");
var User = require("../models/user");
var Bookcopy = require("../models/bookCopy");
var mongoose=require("mongoose");


var getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page

    // var bookData;

    Book.find({})
    .then((data) => {
        res.render("book_list", { books: data, title: "AJ BOOKS LIBRARY" });
    })
    .catch((err) => {
        console.log(err)
        bookdata = {}
    });
    
   
}

var getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    Book.findById(req.params.id)
    .then((book)=>{ 
        res.render("book_detail", { book: book, title: "AJ BOOKS LIBRARY" });
    })
    .catch((err)=>{
        console.log(err);
    })
}

var getLoanedBooks = (req, res) => {

    //TODO: access the books loaned for this user and render loaned books page

    const username =req.user.username;
    User.findOne({ username:  username})  
    .then((user)=> {
    // console.log(user);
     const userId=user._id
     Bookcopy.find({borrower: userId})
     .populate('book')
     .populate('borrower')
     .then((books)=>{
        // console.log(books);
        res.render('loaned_books',{books: books, title: "Loans"});
        }
     )
    }) 
}

var issueBook = (req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same

    mongoose.set('useFindAndModify', false);
    Book.findById(req.body.bid)
    .then((book)=>{
        if (book!==null) {
            if (book) {
                if (book.available_copies) {
                    // console.log("issue:\n",book);
                    Book.updateOne(
                        { _id: req.body.bid}, 
                        { available_copies: book.available_copies - 1 }, 
                        (err) => { if (err) console.log(err) }
                    );
                      
                   
                    let bookAvailable = (book.available_copies - 1) ? true : false;
                    var date = new Date();

    
                    const book_issued = new Bookcopy({
                        book: book._id,
                        status: bookAvailable,
                        borrow_date: date,
                        borrower: req.user._id
                    });  
                    book_issued.save();
                    User.findOneAndUpdate({username: req.user.username},{$push:{loaned_books: book_issued}},  
                        (err)=>{
                          if(err)
                              console.log(err);
                        });
                    Bookcopy.updateOne({book: book},{status: bookAvailable}, (err)=> {console.log(err)});
                    res.redirect('/books/loaned');
                }
            }
        }
    });
}

var returnBooks = (req, res) => {
    const bookId=req.body.bid;
    mongoose.set('useFindAndModify', false);
    Book.findById(bookId)
     .then((book)=>{   
        if (book!==null) {
            if (book) {
                var no_of_copies_available = book.available_copies + 1;
                console.log(no_of_copies_available)
                console.log(book.available_copies)
                console.log(book)
                Book.updateOne(
                    { _id: bookId }, 
                    { available_copies: book.available_copies + 1}, 
                    (err) => { if (err) console.log(err) }
                );
                Bookcopy.findOneAndDelete({book: book })
                    .then((found)=>{
                        // console.log(found) 
                        User.findOneAndUpdate({username: req.user.username},
                            {$pull:{loaned_books: found._id}},
                            (err)=>{
                                if(err)
                                    console.log(err); 
                            });
                        });
                Bookcopy.updateOne({book: book},{status: true}, (err)=> {console.log(err)});
                res.redirect('/books/loaned');
            }else {
                console.log("No Book Found");
            }
        }
    });
}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    Book.findOne({title : req.body.title, author : req.body.author, genre : req.body.genre},(err,book)=>{
        if(!err){
            if(book!==null){
                res.render("book_detail", { book: book, title: "AJ BOOKS LIBRARY" });
            }
            else{ 
                console.log("Book Not Found");
            }
        }
        else{
            console.log(err);
        }
    })
}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    returnBooks,
    searchBooks
}
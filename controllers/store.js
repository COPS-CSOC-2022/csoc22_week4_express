const Book = require('../models/book');
const User = require('../models/user');
const Bookcopy = require('../models/bookCopy');
const { default: mongoose } = require('mongoose');
var getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page
    Book.find({}, function (err, foundBooks) {
        if (!err) {
            res.render("book_list", { books: foundBooks, title: "Books | Library" });
        } else {
            console.log(err);
        }
    });



}

var getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    const Id = req.params.id;
    Book.findOne({ _id: Id }, function (err, bookfound) {
        if (err) {
            console.log(err);
        } else if (!bookfound) {
            res.send("No such book");
        } else {
            console.log("getBook:\n",bookfound);
            res.render('book_detail', { book: bookfound, title: "Book| " + bookfound.title });
        }

    });
    //  res.render('book_detail',{book:{title: "WWE",genre:'action',author:"Me",description:"fight",rating:"MA",mrp:'23',available_copies:"20"}, title: Id});

}

var getLoanedBooks = (req, res) => {

    //TODO: access the books loaned for this user and render loaned books page
    User.findOne({ username: req.user.username }, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                Bookcopy.find({borrower: foundUser._id}).
                populate('book').
                populate('borrower').
                exec((err, foundCopies)=>{
                    if(!err){
                        if(foundCopies){
                            res.render('loaned_books',{books: foundCopies, title: "Loans"});
                        }
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
    Book.findOne({ _id: req.body.bid }, function (err, foundBook){
        if (!err) {
            if (foundBook) {
                if (foundBook.available_copies) {
                    console.log("issue:\n",foundBook);
                    var quant = foundBook.available_copies - 1;
                    Book.updateOne(
                        { _id: req.body.bid }, 
                        { available_copies: quant }, 
                        (err) => { if (err) console.log(err) }
                    );
                    
                   
                    let avail = (quant) ? true : false;
                    var date = new Date();
                    var datetime = date.toLocaleString();
                    console.log(datetime);
                    const issuedBook = new Bookcopy({
                        book: foundBook._id,
                        status: avail,
                        borrow_data: datetime,
                        borrower: req.user._id
                    });
                    issuedBook.save();
                    User.findOneAndUpdate({username: req.user.username},
                        {$push:{loaned_books: issuedBook}},
                        {safe: true, upsert: true, new: true},
                        (err, found)=>{
                          if(err)
                              console.log(err);
                        });

                    Bookcopy.update({book: foundBook},{status: avail}, (err)=> {console.log(err)});
                    res.redirect('/books');
                }else {
                        res.send("Book Unavailable");
                    }
            }
        
        }
    });

}

var returnBook = (req, res) => {
    Book.findOne({ _id: req.body.bid }, function (err, foundBook){
        if (!err) {
            if (foundBook) {
                
                    console.log("issue:\n",foundBook);
                    var quant = foundBook.available_copies + 1;
                    Book.updateOne(
                        { _id: req.body.bid }, 
                        { available_copies: quant }, 
                        (err) => { if (err) console.log(err) }
                    );
                    console.log("date: " , req.body.b_date, " id: ", req.user._id);
                    Bookcopy.findOneAndDelete({borrow_data: req.body.b_date, borrower: req.user._id },
                        (err1,found)=>{
                        if(!err1)
                            User.findOneAndUpdate({username: req.user.username},
                                {$pull:{loaned_books: found.id}},
                                {new: true},
                                (err, found)=>{
                                  if(err)
                                      console.log(err);
                                });});
                    Bookcopy.update({book: foundBook},{status: true}, (err)=> {console.log(err)});
                    res.redirect('/books/loaned');
                }else {
                        res.send("NO Such Book");
                    }
            }
        
        
    });
}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    const title = req.body.title;
    const author = req.body.author;
    const genre = req.body.genre;
    Book.findOne({ title: title, author: author, genre: genre }, function (err, foundBook) {
        if (!err) {
            if (foundBook != null) {
                const id = foundBook._id;
                res.redirect('/book/' + id);
            } else res.send("No such Book!!!");
        } else {
            console.log(err);
        }
    });

}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    returnBook,
    searchBooks
}
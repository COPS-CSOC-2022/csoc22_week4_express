const Book = require("../models/book");
const User = require("../models/user");
const Bookcopy = require("../models/bookCopy")

var getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page
    Book.find({},(err,allBooks)=>{
        if(!err){
            res.render("book_list", { books: allBooks, title: "All Books" });
        }
        else {
            console.log("Some error occured in getAllBooks");
            console.log(err);
        }
    })
    
}

var getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    const bookId = req.params.id;

    Book.findById(bookId,(err,foundBook)=>{
        if(!err){
            res.render("book_detail",{book: foundBook , title: foundBook.name });
        } 
        else {
            console.log("Some error occured in getBook");
            console.log(err);
        }
    })
}

var getLoanedBooks = (req, res) => {
    // console.log(req)
    //TODO: access the books loaned for this user and render loaned books page
    User.findOne({username: req.user.username},(err,foundUser)=>{
        if(!err && foundUser) {
            Bookcopy.find({borrower: foundUser._id}).
                populate('book').
                populate('borrower').
                exec((err, foundBookCopies)=>{
                    if(!err && foundBookCopies){
                        res.render('loaned_books',{books: foundBookCopies, title: "Loaned Books"});
                    }
                })
        } 
        else{
            console.log("Some error occured in getBook");
            console.log(err);
        }
    })
}

var issueBook = (req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    User.findById(req.user._id,(err,foundUser)=>{
        if(foundUser && !err) {
            const loaned_bookId = req.body.bid;
            Book.findById(loaned_bookId,(err,foundBook)=>{
                if(!err && foundBook) {
                    var available= foundBook.available_copies-1;
                    if(available>=0) {
                       
                        Book.updateOne({_id: loaned_bookId},{available_copies: available},(err)=>{
                            if(err) console.log(err);
                        })
                        var ifNextAvail;
                        var date = new Date().toLocaleDateString();
                        (available) ? ifNextAvail=true : ifNextAvail=false;
                        const issuedBook = new Bookcopy({
                            book: req.body.bid,
                            status: ifNextAvail,
                            borrow_date: date,
                            borrower: req.user._id

                        })

                        User.findByIdAndUpdate(req.user._id,{$push : {loaned_books: issuedBook}},(err)=>{
                            if(err) console.log(err);
                        })
                        Bookcopy.updateOne({book: req.body.bid},{status: ifNextAvail},(err)=>{
                            if(err) console.log(err);
                        })
                        issuedBook.save();
                        res.redirect("/books/loaned");
                        
                    }
                    else {
                        res.send("Book not available.");
                    }
                }
                else {
                    res.send("Book Not Found.")
                    if(err) console.log(err);
                }
            })
        }
    })
    // console.log(req);
}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    const searched_title= req.body.title;
    const searched_author= req.body.author;
    const searched_genre= req.body.genre;

    // only title is enough for searching according to me
    Book.findOne({title: searched_title},(err,foundBook)=>{
        if(err) console.log(err);
        else {
            if(foundBook){
                res.redirect(`/book/${foundBook._id}`)
            }
            else {
                res.send("Oops! This book is not present in the library.");
            }
        }
    })
    // console.log(searched_title);
}

var returnBook = (req,res) =>{
    // console.log(req);
    
    Book.findById(req.body.returnBookId,(err,foundBook)=>{
        if(!err && foundBook){
            var aval= foundBook.available_copies+1;

            Book.findByIdAndUpdate(req.body.returnBookId,{available_copies: aval},(err)=>{
                if(err) console.log(err);
            }) //incremented available_copies

            Bookcopy.findOneAndDelete({book: req.body.returnBookId , borrower: req.user._id},(err,foundBookCopy)=>{
                if(err) console.log(err);
                else {
                    User.findByIdAndUpdate(req.user._id,{$pull: {loaned_books: foundBookCopy._id}},(err)=>{
                        if(err) console.log(err);
                    }) // loaned_books pulled
                }
            })//Bookcopy deleted

            Bookcopy.updateMany({book: req.body.returnBookId},{status: true},(err)=>{
                if(err) console.log(err);
            })//rest updated

            res.redirect("/books/loaned");
            
        } 
        else {
            if(err) console.log(err);
            else res.send("Book does'nt Exist");
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
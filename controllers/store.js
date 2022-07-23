var Book = require("../models/book");
var Bookcopy = require("../models/bookCopy");
var mongoose=require("mongoose");
var User = require("../models/user");


var getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page
     
    Book.find({})
    .then((data)=>{
        // console.log(User)
        res.render("book_list", { books:data, title: "Books | Library" });
    })
    .catch((err)=>{
        console.log(err);
    })

    console.log(req.params)

}

var getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    const bookId=req.params.id;
    Book.findById(bookId)
    .then((book)=>{ 
        res.render("book_detail", { book: book, title: "Books | Library" });
    })
    .catch((err)=>{
        console.log(err);
    })
 
}
 
var getLoanedBooks = (req, res) => {
    //TODO: access the books loaned for this user and render loaned books page
    const name=req.user.username;
    User.findOne({ username: name })  
    .then((user)=> {
     const userId=user._id
     Bookcopy.find({borrower: userId})
     .populate('book')
     .populate('borrower')
     .then((books)=>{
        res.render('loaned_books',{books: books, title: "Loans"});
        }
     )
    }) 



}

var issueBook = (req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same

    const bookId=req.body.bid;
    const userId=req.user._id; 
    mongoose.set('useFindAndModify', false);
    Book.findById(bookId)
    .then((book)=>{
        if (book!==null) {
            if (book) {
                if (book.available_copies) {
                    console.log("issue:\n",book);
                    // var quant = book.available_copies - 1;
                    Book.updateOne(
                        { _id: bookId }, 
                        { available_copies: book.available_copies - 1 }, 
                        (err) => { if (err) console.log(err) }
                    );
                      
                   
                    let bookAvailable = (book.available_copies - 1) ? true : false;
                    var date = new Date();

    
                    const book_issued = new Bookcopy({
                        book: book._id,
                        status: bookAvailable,
                        borrow_data: date,
                        borrower: userId
                    });  
                    book_issued.save();
                    User.findOneAndUpdate({username: req.user.username},{$push:{loaned_books: book_issued}},  
                        (err)=>{
                          if(err)
                              console.log(err);
                        });
                    Bookcopy.updateOne({book: book},{status: bookAvailable}, (err)=> {console.log(err)});
                    res.redirect('/books/loaned');
                }else {
                    res.render('errorPage',{message : "The Book You Require is Not in the Stock"});
                    }
            }
        }
    });
   


} 
 
var returnBooks = (req, res) => {
    const bookId=req.body.bid;
    const userId=req.user._id; 
    mongoose.set('useFindAndModify', false);
    Book.findById(bookId)
     .then((book)=>{   
        if (book!==null) {
            if (book) {
                    Book.updateOne(
                        { _id: bookId }, 
                        { available_copies: book.available_copies + 1 }, 
                        (err) => { if (err) console.log(err) }
                    );
                    Bookcopy.findOneAndDelete({book: book })
                        .then((found)=>{
                            console.log(found) 
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
                    res.render('errorPage',{message : "No Such book exist to return"});
                    }
            }
    });
}
 

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details 
    const bookTitle=req.body.title;
    const bookAuthor=req.body.author;
    const bookGenre=req.body.genre;
    console.log(bookTitle)
    console.log(bookAuthor)
    console.log(bookGenre)
    Book.findOne({title : bookTitle,author : bookAuthor,genre : bookGenre},(err,book)=>{
        if(!err){
            if(book!==null){
                res.render("book_detail", { book: book,title: "Books | Library" });
            }
            else{ 
                res.render('errorPage',{message : "No Such book with the required specifics exist in this Library"});
            }
        }
        else{
            res.render('errorPage',{message : "No Such book exist in this Library"});
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
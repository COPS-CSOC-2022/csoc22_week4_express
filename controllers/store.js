const Book = require("../models/book");
const User = require("../models/user");
const Bookcopy = require("../models/bookCopy");
var getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page
    Book.find({},function(err,book_list)
    {
        if(!err)
        {
            res.render("book_list", { books: book_list, title: "Books | Library" });
        }


    });
    
}

var getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    var book_id=req.params.id;
    Book.findOne({_id:book_id},function(err,book)
    {
        if(!err && book)
        {
            res.render("book_detail",{book:book,title:"Book|"+book.title})
        }
        else if(!book)
        {
            res.send("Book is Not registered");
        }
    })
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
    var bookid=req.body.bid;
    Book.findOne({_id:bookid},function(err,found)
    {
        if(!err && found)
        {
           var available_copies=found.available_copies-1;
           if(available_copies>=0)
           {
            Book.updateOne(
                { _id: req.body.bid },
                { available_copies: available_copies },
                (err) => {
                  if (err)
                  {
                    res.send('Error');
                  }  
                }
              );
              let isAvailable = available_copies ? true : false;
              const issuedBook = new Bookcopy({
                book: bookid,
                status: isAvailable,
                borrower: req.user._id,
                borrow_date: Date.now(),
              });
              issuedBook.save();
              User.findOneAndUpdate(
                { username: req.user.username },
                { $push: { loaned_books: issuedBook } },
                { safe: true, upsert: true, new: true },
                (err, founduser) => {
                  if (err) res.send('Error');
                }
              );
              Bookcopy.update(
                { book: found },
                { status: isAvailable },
                {
                    borrow_date:Date.now()
                },
                
                (err) => {
                    if(err){
                  res.send('Error');
                    }
                }
              );
              res.redirect('/books/loaned');
            

           }
          

        }
        else{
            res.send('No books are available to lend');
            console.log(err);
        }
    })
}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details

    
    Book.findOne({title: req.body.title, author: req.body.author, genre: req.body.genre}, (err, found) => {
        
        if(!err && found)
        {
            res.render('book_list', {books: found, title: 'Book | Search'});
        }
        else if(!found)
        {
            res.send("No such Book Exists");
        }
    })
}

var returnBook = (req, res) => {
    Bookcopy.findOne({_id: req.body.bid}).populate('book').exec((err, foundBookCopy) => {
        if (err) console.log(err);
        else {
            var available = foundBookCopy.book.available_copies;
            Book.findByIdAndUpdate(foundBookCopy.book, {$set: {available_copies: available + 1}}, function(err, found)
            {
                if (err) 
                console.log(err)
            });
            User.findByIdAndUpdate(req.user._id, {$pull: {loaned_books: foundBookCopy._id}}, function(err, found)
            {
                if (err) console.log(err)
            });
            Bookcopy.findByIdAndUpdate(foundBookCopy._id, {$set: {status: true, borrower: null, borrow_date: null}}, function(err, found)
            {
                if (err) console.log(err)
            });
            res.redirect('/books/loaned');
        }
    })

}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks,
    returnBook,
}
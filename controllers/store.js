const Books = require("../models/book.js");
const User = require("../models/user.js");
const Bookcopy = require("../models/bookCopy.js");

var getAllBooks = (req, res, next) => {

    Books.find((err, books) => {
        if(err) return next(err);
        res.render("book_list", { books: books, title: "Books | Library" });
    });
}

var getBook = (req, res) => {

    Books.find({ _id: req.params.id}, (err, book) => {
        res.render("book_detail", { title: book[0].title + " | Library ",  book: book[0] });
    })
}

var getLoanedBooks = (req, res) => {
    User.find({ username: req.user.username}, (err, result) => {
        if(result) {
            Bookcopy.find({ borrower: result[0]._id})
            .populate("book")
            .populate("borrower")
            .exec( (err, books) => {

                if(books){
                    res.render("loaned_books.ejs", { title: "My borrowed books | Library", books});
                }
            })
        }
    })
}

var issueBook = (req, res) => {
    
    let errors = [];
    Books.find({ _id: req.body.bid }, (err, result) => {
        console.log(result[0]);

        if(!result) {
            errors.push({ msg: "The book is currently unavailable" });
            res.render("book_detail", { title: req.body.title + " | Library", book: req.body, errors });
        }

        else{
            var copies = result[0].available_copies;
            console.log(copies);
            console.log(req.body.bid);
            if(copies) {
                copies-=1;
                console.log(copies);
                
                //Updating Books model to have one les available copy than before
                Books.updateOne({ _id: req.body.bid},
                    {available_copies: copies })
                    .then( result => {
                        console.log(`Successfully updated`);
                })
            }
                
            var status = false;   //book availability status 
            if(copies>0){
                status = true;
            }
            
            //Creating the document of issued copy and
            //saving it in the database
            const newCopy = new Bookcopy({ book: result[0]._id, status: status, borrow_date: Date.now(), borrower: req.user._id });
            newCopy.save();

            //Updating User model as new book is loaned by the user
            User.updateOne(
                { username: req.user.username },
                { $push: { loaned_books: newCopy }},
                { safe: true, upsert: true, new: true})
                .then( result => {
                    console.log("Successfully updated User model ");
                });

            //UPdating Bookcopy model to display the title of of the book
            //issued in loaned_books.ejs 
            Bookcopy.update({ book: result[0].title }, { status: status }, {borrow_date: Date.now() });
            
            res.redirect("/books/loaned");
        }
        }
    )
}

var searchBooks = (req, res) => {
    
    Books.findOne({ 
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        genre: req.body.genre.trim() },
        (err, book) => {
            if(book) {
                //rendering book_details.ejs view if book found
                res.redirect("/book/"+book._id);
            }
            else{
                //rendering book_list.ejs view in case of error with error message
                let errors= [ { msg: "No such book found" }];
                Books.find((err, books) => {
                    res.render("book_list", { books: books, title: "Books | Library", errors });
                });
                
            }
        } )
}


var returnBooks = (req, res) => {

    console.log(req);
    Bookcopy.findOne({ book: req.body.bid })
        .populate('book')
        .exec( (err, result) => {
            console.log(result);
            console.log("rhdfdv");
            var copies = result.book.available_copies;

            //Updating Books model to have one more available copy than before
            Books.updateOne({ _id: result.book._id },
                {available_copies: copies + 1 })
                .then( result => {
                    console.log(`Successfully updated Books model`);
            });

            //Updating User model to remove the returned book from loaned_book array
            User.updateOne({ _id: req.user._id },
                { $pull: { loaned_books: result._id }})
                .then( result => {
                    console.log("successfully updated User model")
                })

            Bookcopy.deleteOne({ _id: result._id })
                .then( (result) => {
                    console.log("Successfully deleted the returned book from Bookcopy model" );
                })

            res.redirect("/books/loaned");
        } )
}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks,
    returnBooks
}
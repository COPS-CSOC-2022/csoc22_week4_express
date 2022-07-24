const Book = require("../models/book");
const Bookcopy = require("../models/bookCopy");
const User = require("../models/user");
const moment = require("moment");

const getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page
    Book.find()
        .exec((err, result)=>{
            if(err){
                console.log(err);
                res.redirect("/error");
                return;
            }
            return res.render("book_list", { books: result, title: "Books | Library" });  
        })
}

const getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    Book.findById(req.params.id)
    .populate('available_copies')
    .exec((err, result)=>{
        if(err){
            console.log(err);
            return res.redirect("/error");
        }
        let num_available=0;
        result.available_copies.forEach((bookcopy)=>{
            if(bookcopy.status == true) num_available++;
        })
        return res.render("book_detail", {title: "Book | Detail",book: result, num_available});
    })
}

const getLoanedBooks = (req, res) => {
    Bookcopy.find({borrower: req.user.id})
    .populate('book')
    .exec((err, result)=>{
        if(err){
            console.log(err);
            return res.redirect("/error");
        }
        return res.render("loaned_books", {title: "Loaned Books", bookcopies: result})
    })
}

const issueBook = (req, res) => {
    Book.findById(req.body.bid)
    .populate('available_copies')
    .exec((err, result)=>{
        if(err){
            console.log(err);
            return res.redirect("/error");
        }
        let book_issued = false;
        for(bookcopy of result.available_copies){
            if(bookcopy.status == true){
                let date = moment().format('MM/DD/YYYY HH:mm');
                Bookcopy.findOneAndUpdate(
                    {_id: bookcopy.id},
                    {$set: {borrower: req.user.id, borrow_date: date, status: false}},
                    (err, found)=>err?console.log(err):0
                );
                User.findOneAndUpdate(
                    {_id: req.user.id},
                    {$push: {loaned_books: bookcopy.id}},
                    (err, found)=>err?console.log(err):0
                );
                book_issued = true;
                break;
            }
        }
        if(book_issued)
            return res.redirect("/books/loaned");
        else
            return res.redirect("/error");
    })
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
}

const searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    const title = req.body.title,
    author = req.body.author,
    genre = req.body.genre;
    
    Book.findOne({title: title, author: author, genre: genre})
    .populate('available_copies')
    .exec((err, result)=>{
        if(err){
            console.log(err);
            return res.redirect("/error");
        }
        let num_available=0;
        result.available_copies.forEach((bookcopy)=>{
            if(bookcopy.status == true) num_available++;
        })
        return res.render("book_detail", {title: "Book | Detail", book: result, num_available});
    })
}

const returnBook = async(req, res)=>{
    const index = req.user.loaned_books.indexOf(req.body.bcid);
    if(index != -1){
        req.user.loaned_books.splice(index, 1);
        await req.user.save();
        Bookcopy.findOneAndUpdate(
            {_id: req.body.bcid},
            {$set: {status: true, borrower: null, borrow_date: null}},
        ).exec((err, result)=>{
            return res.redirect("/books/loaned");
        })
    }
    else {return res.redirect("/error")}
}

const error = (req, res)=>{
    return res.render("error", {title: "Error"});
}

module.exports = {
    returnBook,
    error,
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks
}
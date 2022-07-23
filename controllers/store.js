const Book = require("../models/Book");
const bookCopy = require("../models/bookCopy");
const User = require("../models/User");

var getAllBooks = async(req, res) => {
    //TODO: access all books from the book model and render book list page
    Book.find({},(err,booklist)=>{
        if(err) console.log(err);
        else {
        // console.log(booklist);
        res.render("book_list", { books: booklist, title: "Books | Library" });
        }
    })
    // res.status(200).json(books)
}

const getBook = async(req, res) => {
    //TODO: access the book with a given id and render book detail page
    const id = req.params['id'];
    console.log(id);
    Book.findOne({_id:id},(err,book)=>{
        // console.log(book);
        if(err) res.status(400).send(err)
        if(!book) {console.log("No such book found");
            res.status(404).send("No such book found");
    }
        else
        res.render("book_detail" ,{book:book , title:"Books",num_available:book.available_copies} )
    })
   
}

var getLoanedBooks = (req, res) => {
console.log(req);
    // User.findOne({username:req.user.username} , (err,user)=>{
    //     if(err) {
    //         console.log(err);
    //         res.status(400).send(err)
    //     }
    //     else {
    //         if(user){
    //             console.log(`The user is ${user}`);
    //         }
    //     }
    // })
    // .populate('loaned_books')
    // .exec((err,loanedBooks)=>{
        
    //     console.log("The loaned books are",loanedBooks);
    //     if(err) console.log(err);
    //     if(loanedBooks) {
    //     res.render('loaned_books' , {books:loanedBooks ,title:"Loaned Books"})
    //     console.log(loanedBooks);
    //     }
    //     else {
    //         res.status(400).send("No loaned books")

    //     }
    // })

    // bookCopy.find({},(err, found)=>{

    // })
       User.findOne({username:req.user.username} , (err,user)=>{
        if(err) {
            console.log(err);
            res.status(400).send(err)
        }
        else {
            if(user){
                // console.log(`The user is ${user}`);
                bookCopy.find({borrower:user._id})
                .populate('book')
                .populate('borrower')
                .exec((err,loanedBooks)=>{
                    // console.log("The loaned books are",loanedBooks);
                    if(err) console.log(err);
                    if(loanedBooks) {
                        // console.log(loanedBooks);
                    res.render('loaned_books' , {books:loanedBooks ,title:"Loaned Books"})
                    }
                    else {
                        res.status(400).send("No loaned books")
                    }
                })
            
        }
    }
})
    //TODO: access the books loaned for this user and render loaned books page
}

var issueBook = async(req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    try {
        // console.log("The request is ",req);
        const book  = await Book.findById(req.body.bid)
        // console.log(book);
        const user = await User.findById(req.user)
        // console.log(book);
        // console.log(user);
        if(user && book.available_copies>0){
            const bookCopy1 = await bookCopy.findOne({book:book._id,status:true});
            console.log("Copy",bookCopy1);
            await User.findByIdAndUpdate(user._id,{$push:{loaned_books:book._id}})
            await bookCopy.findByIdAndUpdate(bookCopy1._id,{$set:{status:false, borrower:user._id,borrow_data:Date.now() }})
            await Book.findByIdAndUpdate(book._id,{$set :{available_copies:book.available_copies-1}})
            res.status(200).redirect('/books/loaned')
        }
        else{
            console.log("No book found");
            res.status(404).send("No such book found");
        }

    } catch (e) {
        res.status(500).send(e)
    }
}

var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    console.log(req.body);
    Book.findOne({title:req.body.title,author:req.body.author , genre:req.body.genre },(err,book)=>{
        if(err) {console.log(err);
        res.status(400).send(`An error occurred ${err}`)
        }
        if(book) 
        res.status(200).render('book_detail' , {book:book , title:"Book: "+book.title , num_available:book.available_copies})

        else {
            console.log("No book found");
            res.status(404).send("No such book found")
        }
    })
}
const returnBooks= async(req,res)=>{
    // res.send(req.body.bid)
    try {
        // console.log(req.user);
        const bookCopy1 = await bookCopy.findById(req.body.bid);
        const user = await User.findById(req.user)
        const book = await Book.findById(bookCopy1.book);
        console.log("the user is:",user);
        console.log("the book is:",book);
        console.log("the bookCopy is:",bookCopy1);
        if(user && bookCopy1.status===false && user.loaned_books.includes(book._id)){
            await User.findByIdAndUpdate(user._id,{$pull:{loaned_books:bookCopy.book}})
            await bookCopy.findByIdAndUpdate(bookCopy1._id,{$set:{status:true, borrower:null,borrow_data:null}})
            await Book.findByIdAndUpdate(bookCopy1.book,{$set :{available_copies:book.available_copies+1}})
            res.status(200).redirect('/books/loaned')
        }
        else{
            console.log("No book found");
            res.status(404).send("No such book found");
        }

    } catch (e) {
        res.status(500).send(e)
    }
}
module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks,
    returnBooks
}
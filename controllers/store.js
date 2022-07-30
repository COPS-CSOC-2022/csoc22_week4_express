const Book = require("../models/book");
const bookCopy = require("../models/bookCopy");
const Bookcopy = require("../models/bookCopy")
const User = require("../models/user")

var getAllBooks = (req, res) => {

    //TODO: access all books from the book model and render book list page

    if(!req.isAuthenticated()){
      res.render('login' , {title : "Login"});
    }
    Book.find()
     .then((result)=>{
        res.render("book_list", { books: result , title: "Books | Library" });
     })
     .catch((err)=>{
        console.log(err);
     })
    
   
}

var getBook = (req, res) => {
    //TODO: access the book with a given id and render book detail page
    const id = req.params.id;

    Book.findById(id)
     .then((result)=>{
        res.render("book_detail", {book : result , title : "Details"} )
     })
     .catch((err)=>{
        console.log(err);
     })
}

var getLoanedBooks = (req, res) => {

    //TODO: access the books loaned for this user and render loaned books page
    Bookcopy.find({borrower : req.user.id }).populate('book').populate('borrower').exec((err,loanedbooks)=>{
      res.render('loaned_books' , {books : loanedbooks , title : 'My Borrowed Books '});
    })
  
  }

var issueBook = (req, res) => {
    
    // TODO: Extract necessary book details from request
    // return with appropriate status
    // Optionally redirect to page or display on same
    Book.findOne({_id:req.body.bid})
     .then((result)=>{
      
      if(result.available_copies > 0){

        const newbookCopy = new Bookcopy ({
          book : result._id,
          status : result.available_copies >1 ? true : false,
          borrow_date : new Date(),
          borrower : req.user.id
        })

        newbookCopy.save().then((response)=>{
          Book.updateOne({_id:result._id} , {available_copies : result.available_copies-1 } , (err,updates)=>{
            if(err)
            console.log(err);
          });
          
          User.updateOne({_id : req.user.id },{$push : {loaned_books : newbookCopy._id }} , (err,updates) =>{
            if(err)
            console.log(err);
          });
         
          res.redirect('/books/loaned');
       
        })
        .catch((err)=>{
          console.log(err);
        })
      }

      else
      res.send('No more copies available ');

     })
     .catch((err)=>{
      console.log(err);
     })
}

var returnBook = (req,res)=>{


  Bookcopy.findOneAndDelete({_id : req.body.id})
  .then((result)=>{
    console.log('Deleted Successfully')
   })
  .catch((err)=>{
    console.log(err);
   })
  
   User.updateOne({_id : req.user.id} , {$pull : {loaned_books : req.body.id}})
  .then((result)=>{
    console.log('Updated Successfully')
   })
  .catch((err)=>{
    console.log(err);
   })
   
   Book.updateOne({_id : req.body.bid} , {available_copies  : parseInt(req.body.copies) +1})
  .then((result)=>{
    console.log('Updated Successfully')
   })
  .catch((err)=>{
    console.log(err);
   })

  Bookcopy.updateOne({book : req.body.id , borrower : req.user.id } , {status : true})
  .then((result)=>{
    console.log('Updated Successfully')
   })
  .catch((err)=>{
    console.log(err);
   })
  res.redirect('/books/loaned');

}
   
var searchBooks = (req, res) => {
    // TODO: extract search details
    // query book model on these details
    // render page with the above details
    const {title,author,genre} = req.body
    Book.find({"title":{$regex:title, "$options" : "i"},"author":{$regex:author, "$options" : "i"},"genre":{$regex:genre, "$options" : "i"}})
     .then((result)=>{
      res.render('book_list' , {books : result , title : "Books | Library"})
     })
     .catch((err)=>{
      console.log(err);
     })
}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    returnBook,
    searchBooks
}
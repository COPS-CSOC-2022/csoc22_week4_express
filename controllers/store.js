const books=require("../models/book.js")

var getAllBooks = (req, res) => {
    //TODO: access all books from the book model and render book list page
    const list=books.find({},function(err,data){        //data contains all data in database 
        if(err) throw err
        const list=data;
        res.render("book_list", { list, title: "Books | Library" });
    })
}
const getBook =async(req, res) => {
    //TODO: access the book with a given id and render book detail page
     let book=await books.findById(req.params.id)
     res.render("book_detail",{book,title: book.title})    }
var getLoanedBooks = (req, res) => {
//TODO: access the books loaned for this user and render loaned books page
}
var issueBook = (req, res) => {
    } 

const searchBooks = async(req, res) => {
    
     let book1=await books.find()
      book1.forEach(function(book){
      let str1=book.title.toLowerCase();   //user can input in lowercase or uppercase or even mixed characters so converting to lower case
      let str2=req.body.title.toLowerCase();
      let str3=book.author.toLowerCase();   //user can input in lowercase or uppercase or even mixed characters so converting to lower case
      let str4=req.body.author.toLowerCase();
      let str5=book.genre.toLowerCase();   //user can input in lowercase or uppercase or even mixed characters so converting to lower case
      let str6=req.body.genre.toLowerCase();
      
      if((str1==str2)&&(str3=str4)&&(str5=str6)){
        res.render("book_detail",{book,title: book.title})   
      }
      else if(str1==str2) {                   //title is unique
        res.render("book_detail",{book,title: book.title})   
     }
     else if((str5==str6)&&(str3==str4)){
        res.render("book_detail",{book,title: book.title})   
     }
     else if(str3==str4){
        res.render("book_detail",{book,title: book.title})   
     } 
     else if(str5==str6){
        res.render("book_detail",{book,title: book.title})   
         
    }   // TODO: extract search details
    // query book model on these details
    // render page with the above details 
 })
}

module.exports = {
    getAllBooks,
    getBook,
    getLoanedBooks,
    issueBook,
    searchBooks
}
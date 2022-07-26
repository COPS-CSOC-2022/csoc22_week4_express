var mongoose=require("mongoose");

//DEFINING THE BOOK  COPIES MODEL

var bookCopySchema=new mongoose.Schema({
//TODO: DEFINE the following attributes-
 
//embed reference to id of book of which its a copy
book:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }, 

//TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE 
status: Boolean,

//date when book was borrowed
borrow_date: Date,

//embed reference to id of user who has borrowed it 
borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports=mongoose.model("Bookcopy", bookCopySchema);
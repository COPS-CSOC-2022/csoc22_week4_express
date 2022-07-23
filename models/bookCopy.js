var mongoose = require("mongoose");
const User = require("./user");
// //DEFINING THE BOOK  COPIES MODEL
// var bookCopySchema=new mongoose.Schema({
// //TODO: DEFINE the following attributes-
//  book:  //embed reference to id of book of which its a copy
//  status: //TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE
//  borrow_data: //date when book was borrowed
//  borrower: //embed reference to id of user who has borrowed it
// })
// module.exports=mongoose.model("Bookcopy",bookCopySchema);

//DEFINING THE BOOK  COPIES MODEL
var bookCopySchema = new mongoose.Schema({
  //TODO: DEFINE the following attributes-
  //book:  //embed reference to id of book of which its a copy
  //status: //TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE
  //borrow_data: //date when book was borrowed
  //borrower: //embed reference to id of user who has borrowed it
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  status: Boolean,
  borrow_date: { type: Date, default: () => Date.now() },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Bookcopy", bookCopySchema);

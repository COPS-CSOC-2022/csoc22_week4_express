var mongoose = require("mongoose");
const { DateTime } = require("luxon");  //for date handling

//DEFINING THE BOOK  COPIES MODEL
var bookCopySchema = new mongoose.Schema({
  //TODO: DEFINE the following attributes-
  //  book:  //embed reference to id of book of which its a copy
  book: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  //  status: //TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE
  status: {
    type: Boolean,
    default: true,
  },
  // borrow_data: //date when book was borrowed
  borrow_date: {
    type: String,
    default: DateTime.now().toLocaleString(),
  },
  //  borrower: //embed reference to id of user who has borrowed it
  borrower: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      // default:null
    },
});
module.exports = mongoose.model("Bookcopy", bookCopySchema);

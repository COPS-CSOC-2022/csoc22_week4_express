var mongoose = require("mongoose");
//DEFINING THE BOOK  COPIES MODEL
var bookCopySchema = new mongoose.Schema({
  //TODO: DEFINE the following attributes-
  //  book:  //embed reference to id of book of which its a copy
  book: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
    },
  ],
  //  status: //TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE
  status: {
    type: Boolean,
    default: true,
    required: true
  },
  // borrow_data: //date when book was borrowed
  borrow_date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  //  borrower: //embed reference to id of user who has borrowed it
  borrower: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
module.exports = mongoose.model("Bookcopy", bookCopySchema);

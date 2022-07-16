const mongoose = require("mongoose");
//DEFINING THE BOOK  COPIES MODEL
const bookCopySchema = new mongoose.Schema({
  //TODO: DEFINE the following attributes-
  book: {
    //embed reference to id of book of which its a copy
    type: Schema.Types.ObjectId,
    ref: "Book",
  },
  status: Boolean, //TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE
  borrow_data: Date, //date when book was borrowed
  borrower: {
    //embed reference to id of user who has borrowed it
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Bookcopy", bookCopySchema);

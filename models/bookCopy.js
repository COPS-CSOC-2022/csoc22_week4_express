const mongoose=require("mongoose");
//DEFINING THE BOOK  COPIES MODEL
const bookCopySchema=new mongoose.Schema({
    //TODO: DEFINE the following attributes-
    book:  { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    status: Boolean,  //available status
    borrow_date: Date,
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports=mongoose.model("Bookcopy",bookCopySchema);
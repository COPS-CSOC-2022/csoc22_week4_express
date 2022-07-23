var mongoose=require("mongoose");
//DEFINING THE BOOK  COPIES MODEL
var bookCopySchema=new mongoose.Schema({
//TODO: DEFINE the following attributes-
    book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        },
    status: Boolean,
    borrow_date: {
        type: Date,
        default: ()=>new Date()
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})
module.exports=mongoose.model("Bookcopy",bookCopySchema);
var mongoose=require("mongoose");
//DEFINING THE BOOK  COPIES MODEL
var bookCopySchema=new mongoose.Schema({
//TODO: DEFINE the following attributes-
 book: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Book'
 }, //embed reference to id of book of which its a copy
 status: Boolean,//TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE 
 borrow_date:{
    type: Date,
    default: () => Date.now()
 },//date when book was borrowed
 borrower: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
 }//embed reference to id of user who has borrowed it 
})
module.exports=mongoose.model("Bookcopy",bookCopySchema);
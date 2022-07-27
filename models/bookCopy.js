var mongoose=require("mongoose");
//DEFINING THE BOOK  COPIES MODEL
var bookCopySchema=new mongoose.Schema({
//TODO: DEFINE the following attributes-
book: {type:mongoose.ObjectId ,ref:"Book"},//embed reference to id of book of which its a copy

status:Boolean,//TRUE IF AVAILABLE TO BE ISSUED, ELSE FALSE 

borrow_data:{type:String,default:date.now}, 

borrower: {type:mongoose.ObjectId,ref:"User"}
})
module.exports=mongoose.model("Bookcopy",bookCopySchema);
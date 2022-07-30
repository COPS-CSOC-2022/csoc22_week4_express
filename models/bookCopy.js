var mongoose=require("mongoose");
//DEFINING THE BOOK  COPIES MODEL
var bookCopySchema=new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'book',
    required: [true, 'Book is a required field.']
},
status: {
    type: Boolean,
    required: true,
    default: true                                   // True => Available to be issued
},
borrow_date: {
    type: Date,
    required: true,
    default: Date.now,
    get: (d) => {
        return Date(d).split("GMT")[0];
    }
},
borrower: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'user'
}
   
  
}, { timestamps: true })
module.exports=mongoose.model("bookcopy",bookCopySchema);
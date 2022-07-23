var mongoose=require("mongoose");
//DEFINING THE BOOK MODEL
var bookSchema=new mongoose.Schema({
	/*TODO: DEFINE the following attributes-
    title, genre, author, description, rating (out of 5), mrp, available_copies(instances).
     */
    title: {
        type : String,
        default : ""
    },
    genre: {
        type: String,
        default: ""
    },
    author: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        default: ""
    },
    mrp: {
        type: Number,
        default: ""  
    },
    instances:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookcopy",
        default: ""
    }],
})
module.exports=mongoose.model("Book",bookSchema);
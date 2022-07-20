var mongoose=require("mongoose");
//DEFINING THE BOOK MODEL
var bookSchema=new mongoose.Schema({
	/*TODO: DEFINE the following attributes-
    title, genre, author, description, rating (out of 5), mrp, available_copies(instances).
     */
    title: String,
    genre: String,
    author: String,
    description: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    mrp: Number,
    available_copies: {
        type: Number,
        min: 0,
    }

})
module.exports=mongoose.model("Book",bookSchema);
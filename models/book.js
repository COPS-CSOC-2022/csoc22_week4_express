const mongoose=require("mongoose");
//DEFINING THE BOOK MODEL
const bookSchema=new mongoose.Schema({
	/*TODO: DEFINE the following attributes-
    title, genre, author, description, rating (out of 5), mrp, available_copies(instances).
     */
    title:String,
    author:String,
    genre:String,
    description:String,
    rating:{
        type:Number,
        min:[1,'enter between 1-5'],
        max:[5,'enter between 1-5'],
        required:true},
    mrp:Number,
    available_copies:Number
})
module.exports=mongoose.model("Book",bookSchema)
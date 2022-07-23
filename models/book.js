var mongoose=require("mongoose");
//DEFINING THE BOOK MODEL
var bookSchema= mongoose.Schema({
	/*TODO: DEFINE the following attributes-
    title, genre, author, description, rating (out of 5), mrp, available_copies(instances).
     */
    title:{
        type:String,
        require:true,
    },
    genre:{
        type:String,
        require:true,
    },
    author:{
        type:String,
        require:true
    },
    description:{
        type:String,
    },
    rating:{
        type:Number,
        min:0,
        max:5,
    },
    mrp:{
        type:Number,
        min:0,
        require:true,
    
    },
    available_copies:{
        type:Number,
        require:true,
    }
})
module.exports=mongoose.model("Book",bookSchema);
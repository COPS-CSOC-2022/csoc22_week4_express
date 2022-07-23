var mongoose=require("mongoose");
var	passportLocal=require("passport-local-mongoose");
//DEFINING THE USER MODEL
var userSchema=new mongoose.Schema({

	//TODO: DEFINE USERNAME AND PASSSWORD ATTRIBUTES
    username: String,
    password: String,
    loaned_books:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookcopy"
    }]
})
userSchema.plugin(passportLocal);
module.exports=mongoose.model("User",userSchema);
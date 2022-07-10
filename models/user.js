var mongoose=require("mongoose");
var	passportLocal=require("passport-local-mongoose");
//DEFINING THE USER MODEL
var userSchema=new mongoose.Schema({

	//TODO: DEFINE USERNAME AND PASSSWORD ATTRIBUTES


    loaned_books:[
        //TODO: embed reference to id's of book copies loaned by this particular user in this array
    ]
})
userSchema.plugin(passportLocal);
module.exports=mongoose.model("User",userSchema);
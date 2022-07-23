const mongoose=require("mongoose");
var	passportLocal=require("passport-local-mongoose");
//DEFINING THE USER MODEL
const userSchema=new mongoose.Schema({

	//TODO: DEFINE USERNAME AND PASSSWORD ATTRIBUTES
    username:{
        type:String,
        minlength:3,
        unique:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    }
    // password:{
    //     type:String,
    //     minlength:3,
    // }
,
    loaned_books:[
        //TODO: embed reference to id's of book copies loaned by this particular user in this array
        {
            type:mongoose.Schema.Types.ObjectId , 
            ref:'Bookcopy'
        }
    ]
},{
    timestamps:true
})
userSchema.plugin(passportLocal);
module.exports=mongoose.model("User",userSchema);
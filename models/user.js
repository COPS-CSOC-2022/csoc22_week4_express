let mongoose = require("mongoose");
let	passportLocal = require("passport-local-mongoose");
let userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: String,
    
    loaned_books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bookcopy',
        required: true,
        default: []
    }]
})
userSchema.plugin(passportLocal);

module.exports = mongoose.model("User", userSchema);
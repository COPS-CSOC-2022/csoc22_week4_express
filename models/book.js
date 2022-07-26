var mongoose = require("mongoose");
//DEFINING THE BOOK MODEL
var bookSchema = new mongoose.Schema({
    /*TODO: DEFINE the following attributes-
    title, genre, author, description, rating (out of 5), mrp, available_copies(instances).
     */
    title: {
        type: String,
        require: true,
        trim: true
    },
    genre: {
        type: String,
        require: true,
        trim: true
    },
    author: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: false,
        // trim: true 
    },
    rating: {
        type: String,
        require: true
    },
    mrp: {
        type: Number,
        require: true
    },
    available_copies: {
        type: Number,
        require: true
    },

})
module.exports = mongoose.model("Book", bookSchema);
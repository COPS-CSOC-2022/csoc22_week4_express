let mongoose = require("mongoose");
let bookSchema = new mongoose.Schema({
    title: String,
    genre: String,
    author: String,
    description: String,
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    mrp: Number,
    available_copies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bookcopy',
    }],
})
module.exports = mongoose.model("Book", bookSchema);
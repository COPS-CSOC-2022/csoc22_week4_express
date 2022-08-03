var mongoose = require("mongoose");
//DEFINING THE BOOK MODEL
var bookSchema = new mongoose.Schema({
  /*TODO: DEFINE the following attributes-
    title, genre, author, description, rating (out of 5), mrp, available_copies(instances).
     */
  title: { type: String, required: true, trim: true },
  genre: String,
  author: { type: String, required: true, trim: true },
  desctiption: String,
  rating: { type: Number, required: true, min: 0, max: 5 },
  mrp: Number,

  available_copies: {
    type: Number,
    required: true,
    default: 0
}
  });
module.exports = mongoose.model("Book", bookSchema);

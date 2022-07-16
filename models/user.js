const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
//DEFINING THE USER MODEL
const userSchema = new mongoose.Schema({
  //TODO: DEFINE USERNAME AND PASSSWORD ATTRIBUTES
  username: {
    type: String,
    required: true,
    unique: true,
  },

  loaned_books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookcopy",
    },
    //TODO: embed reference to id's of book copies loaned by this particular user in this array
  ],
});
userSchema.plugin(passportLocal);
module.exports = mongoose.model("User", userSchema);

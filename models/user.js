var mongoose = require("mongoose");
const Bookcopy = require("./bookCopy");
var passportLocal = require("passport-local-mongoose");
//DEFINING THE USER MODEL
var userSchema = new mongoose.Schema({
  //TODO: DEFINE USERNAME AND PASSSWORD ATTRIBUTES
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // Password not given,it will be handeled by middleware of passport
  // In database,instead of password hash and salt is saved
  // It is done to keep the password protected and save it from hack
  loaned_books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookCopy',
    },
    //TODO: embed reference to id's of book copies loaned by this particular user in this array
  ],
});
userSchema.plugin(passportLocal);
module.exports = mongoose.model("user", userSchema);

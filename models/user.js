var mongoose = require("mongoose");
var passportLocal = require("passport-local-mongoose");

/* Library to hash passwords before storing in database */
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    loaned_books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookCopy'
    }]
})

/* Hashing the password when it is passed to be stored in the database */
userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();                        // Only hash the password if it has been modified (or is new)

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {                 // Generate a salt
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

/* Method for password validation */
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.plugin(passportLocal);
module.exports = mongoose.model("user", userSchema);
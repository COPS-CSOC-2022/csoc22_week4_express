let mongoose = require("mongoose");
let bookCopySchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    status: Boolean,
    borrow_date: {
        type: Date,
        default: () => Date.now(),
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
})
module.exports = mongoose.model("Bookcopy", bookCopySchema);
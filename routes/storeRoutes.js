const express = require('express');
const router = express.Router();

var store = require("../controllers/store");
var middleware = require("../middleware");              // No need of writing index.js as directory always calls index.js by default

/* Defining the controllers for all the routes */
router.get("/", store.getAllBooks);
router.get("/loaned", middleware.isLoggedIn, store.getLoanedBooks);
router.get("/:id", store.getBook);                      // Requests with parameters should be handled at the last
router.post("/issue", middleware.isLoggedIn, store.issueBook);
router.post("/search-book", store.searchBooks);


module.exports = router;
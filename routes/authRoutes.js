const express = require('express');
const router = express.Router();

var auth = require('../controllers/auth');
var middleware = require("../middleware");             // No need of writing index.js as directory always calls index.js by default

/* Defining the controllers for all the routes */
router.get("/login", middleware.isLoggedOut, auth.getLogin);
router.post("/login", middleware.isLoggedOut, auth.postLogin);
router.get("/register", middleware.isLoggedOut, auth.getRegister);
router.post("/register", middleware.isLoggedOut, auth.postRegister);
router.get("/logout", middleware.isLoggedIn, auth.logout);

module.exports = router;
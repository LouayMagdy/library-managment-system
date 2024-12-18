const express = require("express");
const router = express.Router();

const { authBorrower, authLibrarian} = require('../middlewares/auth')
const { generateNewPassKey, checkoutBook, returnBook } = require("../controllers/borrowControllers")

// Generates a one time token of 6 digits so that we ensure that
// the borrower is not stored as a borrower/returner of some book
// while in fact he does not borrow/return the book.  
router.get("/passKey", authBorrower, generateNewPassKey);
//checkout book route
router.post("/checkout", authLibrarian, checkoutBook);
// return book route
router.put("/return", authLibrarian, returnBook);


module.exports = router;
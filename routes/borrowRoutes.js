const express = require("express");
const router = express.Router();

const { authBorrower, authLibrarian} = require('../middlewares/auth')
const { generateNewPassKey, 
        checkoutBook, 
        returnBook, 
        getBookStatus, 
        getBorrowedBooks,
        getOlderNBorrowedBooks,
        getNewerNBorrowedBooks } = require("../controllers/borrowControllers")

// Generates a one time token of 6 digits so that we ensure that
// the borrower is not stored as a borrower/returner of some book
// while in fact he does not borrow/return the book.  
router.get("/passKey", authBorrower, generateNewPassKey);
//checkout book route
router.post("/checkout", authLibrarian, checkoutBook);
// return book route
router.put("/return", authLibrarian, returnBook);


// tracking book status route
router.get("/bookStatus/:isbn", authLibrarian, getBookStatus)
//tracking borrowerBooks
router.get("/myBooks", authBorrower, getBorrowedBooks)
// listing all borrowed books and overdue books
// accept GMT Timestamp in ISO format as query parameter
router.get('/older/:pageSize', authLibrarian, getOlderNBorrowedBooks);
router.get('/newer/:pageSize', authLibrarian, getNewerNBorrowedBooks);


module.exports = router;
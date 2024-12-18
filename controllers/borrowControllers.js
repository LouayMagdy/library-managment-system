const { deleteCurrentPassKey, addPassKey, getPassKey } = require("../services/borrowServices/passkeyService")
const { addToBorrowTable, decrementBookQuatity } = require("../services/borrowServices/borrowService")

const {createCustomError} = require('../errors/customError');

const generateNewPassKey = async(req, res, next) => {
    try{
        let {email} = req.body
        email = email.toLowerCase(); // just to be valid if it is not extracted from jwt in future routes
        await deleteCurrentPassKey(email);
        const passkey = Math.floor(100000 + Math.random() * 900000).toString();
        await addPassKey(email, passkey);
        return res.status(200).json({passkey});
    } catch(err){
        console.log(err.message);
        next({})
    }
}

const checkoutBook = async(req, res, next) => {
    try{
        let {borrower_mail, book_isbn, due_date, passkey} = req.body;
        let fetchedPassKey = await getPassKey(borrower_mail);
        if(passkey !== fetchedPassKey) return next(createCustomError("Borrower PassKey is Invalid!", 400));
        await addToBorrowTable(borrower_mail, book_isbn, due_date.replace('T', ' ').replace('Z', ''));
        await decrementBookQuatity(book_isbn);
        await deleteCurrentPassKey(borrower_mail); // to avoid misuse by librarians
        return res.status(201).json({message: `Book: ${book_isbn} registered for borrowing by ${borrower_mail} until ${due_date}`});
    }catch(err){
        console.log(err.message);
        next({})
    }
}

module.exports = {generateNewPassKey, checkoutBook}
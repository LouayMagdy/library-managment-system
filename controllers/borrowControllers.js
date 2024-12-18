const { deleteCurrentPassKey, addPassKey, getPassKey } = require("../services/borrowServices/passkeyService")
const { addToBorrowTable } = require("../services/borrowServices/borrowService")

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
        let {borrower_mail, book, passkey} = req.body;
        let fetchedPassKey = await getPassKey(borrower_mail);
        if(passkey !== fetchedPassKey) return next(createCustomError("Borrower PassKey is Invalid!", 400));
        await addToBorrowTable(borrower_mail, book.isbn, book.due_date.replace('T', ' ').replace('Z', ''));
        await deleteCurrentPassKey(borrower_mail); // to avoid misuse by librarians
        return res.status(201).json({message: `Book: ${book.isbn} registered for borrowing by ${borrower_mail} until ${book.due_date}`});
    }catch(err){
        console.log(err.message);
        next({})
    }
}

module.exports = {generateNewPassKey, checkoutBook}
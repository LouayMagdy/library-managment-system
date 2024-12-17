const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const {createCustomError} = require('../errors/customError');
const { addBook, 
    isBookExisted} = require('../services/bookManagementService')


const addBookController = async(req, res, next) => {
    try{
        let {title, author, isbn, quantity, section, bay, shelf} = req.body;
        if(quantity <= 0) return next(createCustomError("Book Quantity Should be a Positive Value", 400));
        if(!(/^[A-Z]$/.test(shelf))) return next(createCustomError("Book Shelf Should be a Character from A to Z", 400));
        if(isbn.length > 13) return next(createCustomError("Book ISBN Should be at most 13 Characters long", 400));
        let isBookFound = await isBookExisted(isbn);
        if(isBookFound) return next(createCustomError("Conflict! The Book already found!", 409));
        await addBook(title, author, isbn, quantity, section, bay, shelf);
        return res.status(201).json({message: "New Book Added Successfully!"});
    } catch(err){
        console.log(err.message);
        return next({});
    }
}

module.exports = {addBookController};
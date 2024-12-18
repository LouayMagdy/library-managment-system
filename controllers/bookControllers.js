const {createCustomError} = require('../errors/customError');
const { addBook, 
        updateBook,
        deleteBook,
        isBookExisted} = require('../services/bookServices/bookManagementService');
const { getBookByIsbn, getNewerNBooksThanTimestamp, getOlderNBooksThanTimestamp} = require('../services/bookServices/bookQueryService');


const addBookController = async(req, res, next) => {
    try{
        let {title, author, isbn, quantity, section, bay, shelf} = req.body;
        if(quantity <= 0) return next(createCustomError("Book Quantity Should be a Positive Value", 400));
        if(!(/^[A-Z]$/.test(shelf))) return next(createCustomError("Book Shelf Should be a Character from A to Z", 400));
        if(isbn.length > 13) return next(createCustomError("Book ISBN Should be at most 13 Characters long", 400));
        if(!(/^[A-Za-z\s\-]+$/.test(author))) return next(createCustomError("Book Author Name is not valid", 400));
        let isBookFound = await isBookExisted(isbn);
        if(isBookFound) return next(createCustomError("Conflict! The Book already found!", 409));
        await addBook(title, author, isbn, quantity, section, bay, shelf);
        return res.status(201).json({message: "New Book Added Successfully!"});
    } catch(err){
        console.log(err.message);
        return next({});
    }
}

const updateBookController = async(req, res, next) => {
    try{
        let {title, author, isbn, quantity, section, bay, shelf} = req.body;
        let matchedBooks = await getBookByIsbn(isbn);
        if(matchedBooks.length === 0) return next(createCustomError("Book not found!", 404));
        let fetchedBook = matchedBooks[0];
        title = title || fetchedBook.title;
        author = author || fetchedBook.author;
        if(!(/^[A-Za-z\s\-]+$/.test(author))) return next(createCustomError("Book Author Name is not valid", 400));
        quantity = quantity || fetchedBook.available_quantity;
        if(quantity <= 0) return next(createCustomError("Book Quantity Should be a Positive Value", 400));
        section = section || fetchedBook.section;
        bay = bay || fetchedBook.bay_number;
        shelf = shelf || fetchedBook.shelf_number;
        if(!(/^[A-Z]$/.test(shelf))) return next(createCustomError("Book Shelf Should be a Character from A to Z", 400));
        await updateBook(title, author, isbn, quantity, section, bay, shelf);
        return res.status(200).json({message: "Book Data Updated Successfully!"});
    } catch(err){
        console.log(err.message);
        return next({});
    }
}

const deleteBookController = async(req, res, next) =>{
    try{
        let isbnToDelete = req.params.isbn;
        let isBookFound = await isBookExisted(isbnToDelete);
        if (!isBookFound) return next(createCustomError("Book Not Found!", 404));
        await deleteBook(isbnToDelete);
        return res.status(200).json({message: "Book Deleted Successfully!"});
    } catch(err){
        console.log(err.message);
        return next(createCustomError("Conflict! This Book is already borrowed and cannot be deleted!", 409))
    }
}

const getNewerNBooks = async(req, res, next) => {
    try{
        let pageSize = req.params.pageSize;
        let timestamp = req.query.timestamp || new Date().toISOString();
        timestamp = timestamp.replace('T', ' ').replace('Z', '');
        let isbn = req.query.isbn;
        let title = req.query.title;
        let author = req.query.author;
        let books = await getNewerNBooksThanTimestamp(isbn, title, author, timestamp, pageSize);
        return res.status(200).json({books});
    } catch(err){
        console.log(err)
        return next({})
    }
}

const getOlderNBooks = async(req, res, next) => {
    try{
        let pageSize = req.params.pageSize;
        let timestamp = req.query.timestamp || new Date().toISOString();
        timestamp = timestamp.replace('T', ' ').replace('Z', '');
        let isbn = req.query.isbn;
        let title = req.query.title;
        let author = req.query.author;
        let books = await getOlderNBooksThanTimestamp(isbn, title, author, timestamp, pageSize);
        return res.status(200).json({books});
    } catch(err){
        console.log(err)
        return next({})
    }
}

module.exports = {addBookController, updateBookController, deleteBookController, getNewerNBooks, getOlderNBooks};
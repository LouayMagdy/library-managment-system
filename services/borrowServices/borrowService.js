const { pool } = require('../../config/db');

const addToBorrowTable = async(borrower_mail, book_isbn, due_date) => {
    let stmt = `INSERT INTO borrow(borrower_mail, book_isbn, due_date) VALUES(?, ?, CONVERT_TZ(?, '+00:00', 'SYSTEM'))`;
    await pool.execute(stmt, [borrower_mail, book_isbn, due_date])
}

const decrementBookQuatity = async(book_isbn) => {
    let stmt = `UPDATE book SET available_quantity = available_quantity - 1
                WHERE isbn = ?`
    await pool.execute(stmt, [book_isbn]);
}

const isBookBorrowedBy = async(borrower_mail, book_isbn) => {
    const query = `SELECT EXISTS(SELECT 1 FROM borrow 
                                 WHERE borrower_mail = ? AND book_isbn = ? AND return_date IS NULL)
                   AS is_book_borrowed`
    let [result] = await pool.execute(query, [borrower_mail, book_isbn]);
    return result[0].is_book_borrowed === 1;
}

const setReturnDateOfBorrowedBook = async(borrower_mail, book_isbn) => {
    let stmt = `UPDATE borrow SET return_date = CURRENT_TIMESTAMP
                WHERE borrower_mail = ? AND book_isbn = ? AND return_date IS NULL`
    await pool.execute(stmt, [borrower_mail, book_isbn])
}

const incrementBookQuatity = async(book_isbn) => {
    let stmt = `UPDATE book SET available_quantity = available_quantity + 1
                WHERE isbn = ?`
    await pool.execute(stmt, [book_isbn]);
}

const getBorrowersDetails = async(book_isbn) => {
    let query = `SELECT user.first_name, user.last_Name, user.email, borrow.borrow_date, borrow.due_date
                 FROM user JOIN borrow on user.email = borrow.borrower_mail
                 WHERE borrow.return_date IS NULL AND borrow.book_isbn = ?
                 ORDER BY borrow.borrow_date DESC`;
    let [result] = await pool.execute(query, [book_isbn]);
    return result;      
}

const getBorrowerBooks = async(borrower_mail) => {
    let query = `SELECT book.title, book.author, book.isbn, borrow.borrow_date, borrow.due_date
                 FROM book JOIN borrow ON book.isbn = borrow.book_isbn
                 WHERE borrow.borrower_mail = ? AND borrow.return_date IS NULL
                 ORDER BY borrow.borrow_date DESC`;
    let [result] = await pool.execute(query, [borrower_mail]);
    return result;  
}

module.exports = {addToBorrowTable, 
                  decrementBookQuatity, 
                  isBookBorrowedBy,
                  setReturnDateOfBorrowedBook,
                  incrementBookQuatity,
                  getBorrowersDetails,
                  getBorrowerBooks
                }
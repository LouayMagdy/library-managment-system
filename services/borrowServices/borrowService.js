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

module.exports = {addToBorrowTable, decrementBookQuatity}
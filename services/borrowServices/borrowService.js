const { pool } = require('../../config/db');

const addToBorrowTable = async(borrower_mail, book_isbn, due_date) => {
    let stmt = `INSERT INTO borrow(borrower_mail, book_isbn, due_date) VALUES(?, ?, CONVERT_TZ(?, '+00:00', 'SYSTEM'))`;
    await pool.execute(stmt, [borrower_mail, book_isbn, due_date])
}

module.exports = {addToBorrowTable}
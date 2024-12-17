const { pool } = require('../config/db');


const addBook = async(title, author, isbn, quantity, section, bayNum, shelfNum) => {
    const stmt = `INSERT INTO book(title, author, isbn, available_quantity, section, bay_number, shelf_number)
                  VALUES(?, ?, ?, ?, ?, ?, ?);`;
    await pool.execute(stmt, [title, author, isbn, quantity, section, bayNum, shelfNum]);
}

const isBookExisted = async(isbn) => {
    const query = `SELECT EXISTS( SELECT 1 FROM book WHERE isbn = ? ) AS is_book_found;`
    let [result] = await pool.execute(query, [isbn]);
    return result[0].is_book_found === 1;
}

const updateBook = async(title, author, isbn, quantity, section, bayNum, shelfNum) => {
    const stmt = `UPDATE book
                  SET title = ?, author = ?, available_quantity = ?, 
                  section = ?, bay_number = ?, shelf_number = ?
                  WHERE isbn = ?;`;
    await pool.execute(stmt, [title, author, quantity, section, bayNum, shelfNum, isbn]);
}

const deleteBook = async(isbn) => {
    const stmt = 'DELETE FROM book WHERE isbn = ?';
    await pool.execute(stmt, [isbn]);
}

module.exports = { addBook, 
                   updateBook,
                   deleteBook,
                   isBookExisted,
                };
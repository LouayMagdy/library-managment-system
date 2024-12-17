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

module.exports = { addBook, 
                   isBookExisted};
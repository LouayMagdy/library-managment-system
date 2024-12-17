const { pool } = require('../config/db');


const getBookByIsbn = async(isbn) => {
    const query = `SELECT title, author, isbn, available_quantity, section, bay_number, shelf_number
                   FROM book WHERE isbn = ?`;
    let [result] = await pool.execute(query, [isbn]);
    return result;
}

module.exports = {getBookByIsbn};
const { pool } = require('../../config/db');
const { BookQueryBuilder } = require('./bookQueryBuilder')


const getBookByIsbn = async(isbn) => {
    const query = `SELECT title, author, isbn, available_quantity, section, bay_number, shelf_number
                   FROM book WHERE isbn = ?`;
    let [result] = await pool.execute(query, [isbn]);
    return result;
}


const getNewerNBooksThanTimestamp = async(isbn, title, author, import_time, pageSize) => {
    let builder = new BookQueryBuilder();
    let isFirst = true;
    if(isbn){
        builder.addIsbnCondition(isFirst, isbn)
        isFirst = false;
    }
    if(title){
        builder.addTitleCondition(isFirst, title)
        isFirst = false;
    }
    if(author){
        builder.addAuthorCondition(isFirst, author)
        isFirst = false;
    }
    builder.addNewerThanCondtion(isFirst, import_time);
    builder.addOrderBYandLimit(pageSize);

    let [result] = await pool.execute(builder.query, builder.values);
    return result;
} 

const getOlderNBooksThanTimestamp = async(isbn, title, author, import_time, pageSize) => {
    let builder = new BookQueryBuilder();
    let isFirst = true;
    if(isbn){
        builder.addIsbnCondition(isFirst, isbn)
        isFirst = false;
    }
    if(title){
        builder.addTitleCondition(isFirst, title)
        isFirst = false;
    }
    if(author){
        builder.addAuthorCondition(isFirst, author)
        isFirst = false;
    }
    builder.addOlderThanCondtion(isFirst, import_time);
    builder.addOrderBYandLimit(pageSize);

    let [result] = await pool.execute(builder.query, builder.values);
    return result;
} 

const getBookAvailableQuantity = async(isbn) => {
    let query = 'SELECT available_quantity FROM book WHERE isbn = ?'
    let [result] = await pool.execute(query, [isbn])
    return result[0].available_quantity;
}

module.exports = {getBookByIsbn, getNewerNBooksThanTimestamp, getOlderNBooksThanTimestamp, getBookAvailableQuantity};
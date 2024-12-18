const { pool } = require('../../config/db');


const deleteCurrentPassKey = async(email) => {
    let stmt = 'DELETE FROM passkey WHERE borrower_mail = ?'
    await pool.execute(stmt, [email]);
}

const addPassKey = async(email, passkey) => {
    let stmt = 'INSERT INTO passkey(borrower_mail, token) VALUES(?, ?)'
    await pool.execute(stmt, [email, passkey]);
}

const getPassKey = async(borrower_mail) => {
    let query = `SELECT token FROM passkey 
                 WHERE borrower_mail = ? 
                 AND TIMESTAMPDIFF(SECOND, generation_time, CURRENT_TIMESTAMP) <= 600`;
    let [result] = await pool.execute(query, [borrower_mail]);
    return result.length === 0? "" : result[0].token;
}


module.exports = { deleteCurrentPassKey, 
                  addPassKey, 
                  getPassKey}
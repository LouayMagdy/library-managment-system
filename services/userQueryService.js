const { pool } = require('../config/db');


const getUserByEmail = async(email) => {
    const query = `SELECT first_name, last_name, email, password_hash
                   FROM user WHERE email = ?`;
    let [result] = await pool.execute(query, [email]);
    return result[0];
}

module.exports = {getUserByEmail}
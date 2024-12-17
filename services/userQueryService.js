const { pool } = require('../config/db');


const getUserByEmail = async(email) => {
    const query = `SELECT first_name, last_name, email, password_hash
                   FROM user WHERE email = ?`;
    let [result] = await pool.execute(query, [email]);
    return result[0];
}

const getOlderNBorrowersThanTimestamp = async(n, timestamp) => {
    const query = `SELECT first_name, last_name, email, registered_at
                   FROM user
                   where role = 'borrower' AND registered_at < CONVERT_TZ(?, '+00:00', 'SYSTEM')
                   ORDER BY registered_at DESC
                   LIMIT ?`
    let [result] = await pool.execute(query, [timestamp, n]);
    return result;
}

const getNewerNBorrowersThanTimestamp = async(n, timestamp) => {
    const query = `SELECT first_name, last_name, email, registered_at
                   FROM user
                   where role = 'borrower' AND registered_at > CONVERT_TZ(?, '+00:00', 'SYSTEM')
                   ORDER BY registered_at DESC
                   LIMIT ?`
    let [result] = await pool.execute(query, [timestamp, n]);
    return result;
}

module.exports = {getUserByEmail, getOlderNBorrowersThanTimestamp, getNewerNBorrowersThanTimestamp}
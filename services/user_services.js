const { pool } = require('../config/db');


const isUserTableEmpty = async () => {
    const query = "SELECT EXISTS(SELECT 1 FROM user LIMIT 1) AS is_not_empty;"
    const [result] = await pool.execute(query);
    return result[0].is_not_empty === 0;
}

const addUser = async(firstName, lastName, email, hashedPassword, role) =>{
    const stmt = `INSERT INTO user (first_name, last_name, email, password_hash, role)
                    VALUES (?, ?, ?, ?, ?)`;
    let [result] = await pool.execute(stmt, [firstName, lastName, email, hashedPassword, role]);
    return result.affectedRows === 1;
}

const getHashedPasswordAndRole = async(email) => {
    const query = "SELECT password_hash, role FROM user WHERE email = ?;"
    let [result] = await pool.execute(query, [email]);
    if(result.length === 0) return "";
    return {hashedPassword: result[0].password_hash, role: result[0].role};
}

const setLastLoginTime = async(email) => {
    const stmt = "UPDATE user SET last_login_at = CURRENT_TIMESTAMP WHERE email = ?;"
    let [result] = await pool.execute(stmt, [email]);
    return result.affectedRows === 1;
}

const getLastLoginTime = async(email) => {
    const query = "SELECT last_login_at FROM user WHERE email = ?;"
    let [result] = await pool.execute(query, [email]);
    if(result.length === 0) return "";
    return result[0].last_login_date;
}


module.exports = {  isUserTableEmpty, 
                    addUser,
                    getHashedPasswordAndRole,
                    setLastLoginTime,
                    getLastLoginTime
                }
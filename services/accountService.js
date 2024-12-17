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
    return result[0].last_login_at;
}

const isUserExisted = async(email, role, last_login_at) => {
    const query = `SELECT EXISTS(
                      SELECT 1 FROM user WHERE email = ? AND role = ? AND last_login_at = CONVERT_TZ(?, '+00:00', 'SYSTEM')
                   ) AS is_user_found`;
    const [result] = await pool.execute(query, [email, role, last_login_at]);
    return result[0].is_user_found === 1;   
}

const isUserExistedByEmail = async(email) => {
    const query = `SELECT EXISTS( SELECT 1 FROM user WHERE email = ? ) AS is_user_found;`
    const [result] = await pool.execute(query, [email]);
    return result[0].is_user_found === 1;  
}

const updateUser = async(email, firstName, lastName, password_hash) => {
    const stmt = `UPDATE user 
                  SET first_name = ?, last_name = ?, password_hash = ?
                  WHERE email = ?;`;
    const [result] = await pool.execute(stmt, [firstName, lastName, password_hash, email]);
    return result.affectedRows === 1;
}

const deleteUser = async(email) => {
    const stmt = 'DELETE FROM user WHERE email = ?';
    await pool.execute(stmt, [email]);
}

module.exports = {  isUserTableEmpty, 
                    isUserExisted,
                    isUserExistedByEmail,
                    addUser,
                    updateUser,
                    deleteUser,
                    getHashedPasswordAndRole,
                    setLastLoginTime,
                    getLastLoginTime
                }
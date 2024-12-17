require('dotenv').config();

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const {getHashedPasswordAndRole, setLastLoginTime, getLastLoginTime} = require('../services/user_services')
const {createCustomError} = require('../errors/customError')

const loginController = async(req, res, next) => {
    const { email, password} = req.body;
    let user = await(getHashedPasswordAndRole(email));
    if(user === "") return next(createCustomError("Authentication failed", 401));
    
    let arePasswordsMatched = await bcrypt.compare(password, user.hashedPassword);
    if(!arePasswordsMatched) return next(createCustomError("Authentication failed", 401));
    
    await setLastLoginTime(email);
    let lastLoginTime = await getLastLoginTime(email);
    if(lastLoginTime === "") return next({});

    let token = jwt.sign({email: email, role:user.role, lastLoginTime: lastLoginTime}, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ token });
}


module.exports = {loginController}
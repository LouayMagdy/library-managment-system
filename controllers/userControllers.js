require('dotenv').config();

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const {getHashedPassword, setLastLoginTime, getLastLoginTime} = require('../services/user_services')
const {createCustomError} = require('../errors/customError')

const loginController = async(req, res, next) => {
    const { email, password, role} = req.body;
    let hashedPassword = await(getHashedPassword(email, role));
    if(hashedPassword === "") return next(createCustomError("Authentication failed", 401));
    
    let arePasswordsMatched = await bcrypt.compare(password, hashedPassword);
    if(!arePasswordsMatched) return next(createCustomError("Authentication failed", 401));
    
    await setLastLoginTime(email, role);
    let lastLoginTime = await getLastLoginTime(email, role);
    if(lastLoginTime === "") return next({});

    let token = jwt.sign({email: email, role:role, lastLoginTime: lastLoginTime}, process.env.JWT_SECRET_KEY);

    console.log(lastLoginTime);
    return res.status(200).json({ token });
}


module.exports = {loginController}
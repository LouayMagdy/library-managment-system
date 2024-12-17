require('dotenv').config();

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const {addUser, getHashedPasswordAndRole, setLastLoginTime, getLastLoginTime, isUserExistedByEmail} = require('../services/user_services')
const {createCustomError} = require('../errors/customError');

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

const addUserController = async(req, res, next) => {
    try{
        let {firstName, lastName, email, password, role} = req.body;
        email = email.toLowerCase(); // emails are case-insensitive in real life.
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        let isDuplicate = await isUserExistedByEmail(email);
        if(isDuplicate) return next(createCustomError("User Already Registered!", 409)); 
        await addUser(firstName, lastName, email, hashedPassword, role);
        res.status(201).json({"message": `A user of role ${role} added successfully!`});
    } catch(err){
        console.log(err.message)
        return next({});
    }
}


module.exports = {loginController, addUserController}
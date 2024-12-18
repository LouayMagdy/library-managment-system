require('dotenv').config();

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const { addUser, 
        updateUser, 
        deleteUser,
        getHashedPasswordAndRole, 
        setLastLoginTime, 
        getLastLoginTime, 
        isUserExistedByEmail} = require('../services/userServices/accountService')

const {getUserByEmail, 
       getOlderNBorrowersThanTimestamp, 
       getNewerNBorrowersThanTimestamp} = require('../services/userServices/userQueryService')

const {createCustomError} = require('../errors/customError');

const loginController = async(req, res, next) => {
    try{
        let { email, password} = req.body;
        email = email.toLowerCase(); // emails are case-insensitive in real life.
        let user = await(getHashedPasswordAndRole(email));
        if(user === "") return next(createCustomError("Authentication failed", 401));
        
        let arePasswordsMatched = await bcrypt.compare(password, user.hashedPassword);
        if(!arePasswordsMatched) return next(createCustomError("Authentication failed", 401));
        
        await setLastLoginTime(email);
        let lastLoginTime = await getLastLoginTime(email);
        if(lastLoginTime === "") return next({});
        let token = jwt.sign({email: email, role:user.role, lastLoginTime: lastLoginTime}, process.env.JWT_SECRET_KEY);
        return res.status(200).json({ token });
    } catch(err){
        console.log(err.message)
        return next({});
    }
}

const addUserController = async(req, res, next) => {
    try{
        let {firstName, lastName, email, password, role} = req.body;
        email = email.toLowerCase(); // emails are case-insensitive in real life.
        if(!(/^[A-Za-z\s\-]+$/.test(firstName)) ) return next(createCustomError("First Name Not valid", 400)); 
        if(!(/^[A-Za-z\s\-]+$/.test(lastName)) ) return next(createCustomError("Last Name Not valid", 400)); 
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

const updateUserController = async(req, res, next) => {
    try{
        let {firstName, lastName, email, password} = req.body;
        email = email.toLowerCase(); // emails are case-insensitive in real life.
        let originalUserData = await getUserByEmail(email); // guaranteed to exist, since token was verified
        if(password){
            let arePasswordsMatched = await bcrypt.compare(password, originalUserData.password_hash);
            password = arePasswordsMatched? originalUserData.password_hash : await bcrypt.hash(password, 10); // 10 is the salt rounds
        } 
        else password = originalUserData.password_hash;
        firstName = firstName || originalUserData.first_name;
        lastName = lastName || originalUserData.last_name;
        if(!(/^[A-Za-z\s\-]+$/.test(firstName)) ) return next(createCustomError("First Name Not valid", 400)); 
        if(!(/^[A-Za-z\s\-]+$/.test(lastName)) ) return next(createCustomError("Last Name Not valid", 400));
        await updateUser(email, firstName, lastName, password);
        return res.status(200).json({message: "User Data Updated Successfully!"});
    } catch(err){
        console.log(err.message);
        return next({});
    }
}

const deleteUserController = async(req, res, next) => {
    try{
        let emailToDelete = req.params.email.toLowerCase();
        let isUserFound = await isUserExistedByEmail(emailToDelete);
        if (!isUserFound) return next(createCustomError("User Not Found!", 404));
        await deleteUser(emailToDelete);
        return res.status(200).json({message: "User Deleted Successfully!"});
    } catch(err){
        console.log(err.message);
        return next(createCustomError("Conflict! This User has not returned some books and cannot be deleted!", 409))
    }
}

const getOlderNBorrowers = async (req, res, next) => {
    try{
        let pageSize = req.params.pageSize;
        let timestamp = req.query.timestamp || new Date().toISOString();
        timestamp = timestamp.replace('T', ' ').replace('Z', '');
        let borrowers = await getOlderNBorrowersThanTimestamp(pageSize, timestamp)
        return res.status(200).json({borrowers});
    } catch(err){
        console.log(err)
        return next({})
    }
}

const getNewerNBorrowers = async (req, res, next) => {
    try{
        let pageSize = req.params.pageSize;
        let timestamp = req.query.timestamp || new Date().toISOString();
        timestamp = timestamp.replace('T', ' ').replace('Z', '');
        let borrowers = await getNewerNBorrowersThanTimestamp(pageSize, timestamp)
        return res.status(200).json({borrowers});
    } catch(err){
        console.log(err)
        return next({})
    }
}

module.exports = {loginController, 
                  addUserController, 
                  updateUserController, 
                  deleteUserController,
                  getOlderNBorrowers,
                  getNewerNBorrowers
                }
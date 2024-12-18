const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createCustomError } = require('../errors/customError')
const { isUserExisted } = require('../services/userServices/accountService')

const authUserForRegistration = async (req, res, next) => { 
    let authHeader = req.headers.authorization;
    // Checking if the user is normal user: (no token sent).
    let isNormalUser = !authHeader;
    if(isNormalUser) {
        req.body.role = 'borrower';
        return next();
    }

    // invalid token type
    if(!authHeader.startsWith('Bearer ')) return next(createCustomError("Authentication failed", 401));
    // validate the token
    let token = authHeader.split(' ')[1];
    try{
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(decoded.role !== 'admin') return next(createCustomError("Authentication failed", 401));
        let lastLoginTime = decoded.lastLoginTime.replace('T', ' ').replace('Z', '');
        let isValidToken = await isUserExisted(decoded.email, decoded.role, lastLoginTime);
        if(!isValidToken) return next(createCustomError("Authentication failed", 401));
        req.body.role = 'librarian';
        next();
    } catch (err){
        console.log(err.message);
        return next({});
    }
}


const authUser = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) 
        return next(createCustomError("Authentication failed", 401));
    let token = authHeader.split(' ')[1];
    try{
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let lastLoginTime = decoded.lastLoginTime.replace('T', ' ').replace('Z', '');
        let isValidToken = await isUserExisted(decoded.email, decoded.role, lastLoginTime);
        if(!isValidToken) return next(createCustomError("Authentication failed", 401));
        req.body.email = decoded.email; // may be required in some services
        next();
    } catch(err){
        console.log(err.message);
        return next({});
    }
}

const authAdmin = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) 
        return next(createCustomError("Authentication failed", 401));
    let token = authHeader.split(' ')[1];
    try{
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let lastLoginTime = decoded.lastLoginTime.replace('T', ' ').replace('Z', '');
        let isValidToken = await isUserExisted(decoded.email, decoded.role, lastLoginTime);
        if(!isValidToken) return next(createCustomError("Authentication failed", 401));
        if(decoded.role !== 'admin') return next(createCustomError("Forbidden! You cannot access this resource", 403));
        next();
    } catch(err){
        console.log(err.message);
        return next({});
    }
}

const authLibrarian = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) 
        return next(createCustomError("Authentication failed", 401));
    let token = authHeader.split(' ')[1];
    try{
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let lastLoginTime = decoded.lastLoginTime.replace('T', ' ').replace('Z', '');
        let isValidToken = await isUserExisted(decoded.email, decoded.role, lastLoginTime);
        if(!isValidToken) return next(createCustomError("Authentication failed", 401));
        if(decoded.role !== 'librarian') return next(createCustomError("Forbidden! You cannot access this resource", 403));
        next();
    } catch(err){
        console.log(err.message);
        return next({});
    }
}

const authBorrower = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) 
        return next(createCustomError("Authentication failed", 401));
    let token = authHeader.split(' ')[1];
    try{
        let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let lastLoginTime = decoded.lastLoginTime.replace('T', ' ').replace('Z', '');
        let isValidToken = await isUserExisted(decoded.email, decoded.role, lastLoginTime);
        if(!isValidToken) return next(createCustomError("Authentication failed", 401));
        if(decoded.role !== 'borrower') return next(createCustomError("Forbidden! You cannot access this resource", 403));
        req.body.email = decoded.email; // required in borrower services
        next();
    } catch(err){
        console.log(err.message);
        return next({});
    }
}




module.exports = {authUserForRegistration, authUser, authAdmin, authLibrarian, authBorrower}
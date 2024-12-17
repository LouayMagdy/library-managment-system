const express = require("express");
const router = express.Router();

const { loginController, 
        addUserController, 
        updateUserController, 
        deleteUserController,
        getOlderNBorrowers,
        getNewerNBorrowers } = require('../controllers/userControllers')
const { authUserForRegistration, authUser, authAdmin} = require('../middlewares/auth')

// user login route
router.post('/login', loginController)
// user registration route
router.post('/register', authUserForRegistration, addUserController)
// update user account route
router.put('/update', authUser, updateUserController)
// delete user account route
router.delete('/delete/:email', authAdmin, deleteUserController)

// listing all borrowers
// accept GMT Timestamp in ISO format as query parameter
router.get('/older/:pageSize', authAdmin, getOlderNBorrowers);
router.get('/newer/:pageSize', authAdmin, getNewerNBorrowers);

module.exports = router
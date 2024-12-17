const express = require("express");
const router = express.Router();
const { loginController, addUserController, updateUserController, deleteUserController} = require('../controllers/userControllers')
const { authUserForRegistration, authUser, authAdmin} = require('../middlewares/auth')

// user login route
router.post('/login', loginController)
// user registration route
router.post('/register', authUserForRegistration, addUserController)
// update user account route
router.put('/update', authUser, updateUserController)
// delete user account route
router.delete('/delete/:email', authAdmin, deleteUserController)


module.exports = router
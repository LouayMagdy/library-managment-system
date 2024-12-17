const express = require("express");
const router = express.Router();
const { loginController, addUserController, updateUserController} = require('../controllers/userControllers')
const { authenticateUserForRegistration, authenticateUser} = require('../middlewares/authenticators')

// user login route
router.post('/login', loginController)
// user registration route
router.post('/register', authenticateUserForRegistration, addUserController)
// update user account route
router.put('/update', authenticateUser, updateUserController)


module.exports = router
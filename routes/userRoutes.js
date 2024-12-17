const express = require("express");
const router = express.Router();
const { loginController, addUserController} = require('../controllers/userControllers')
const { authenticateUserForRegistration } = require('../middlewares/authenticators')

// user login route
router.post('/login', loginController)
// user registration route
router.post('/register', authenticateUserForRegistration, addUserController)


module.exports = router
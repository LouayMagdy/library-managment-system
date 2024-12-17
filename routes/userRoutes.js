const express = require("express");
const router = express.Router();
const { loginController } = require('../controllers/userControllers')


// login route
router.post('/login', loginController)
// register route (if admin --> create a librarian, if no token --> create a borrower) 
// SELECT CONVERT_TZ('2024-12-17 00:04:10', '+00:00', 'SYSTEM');



module.exports = router
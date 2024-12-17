const express = require("express");
const router = express.Router();

const { authLibrarian } = require('../middlewares/auth')
const { addBookController, updateBookController} = require('../controllers/bookControllers');

router.post('/add', authLibrarian, addBookController)
router.put('/update', authLibrarian, updateBookController)

module.exports = router;
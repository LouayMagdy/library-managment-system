const express = require("express");
const router = express.Router();

const { authLibrarian } = require('../middlewares/auth')
const { addBookController, updateBookController, deleteBookController} = require('../controllers/bookControllers');

router.post('/add', authLibrarian, addBookController)
router.put('/update', authLibrarian, updateBookController)
router.delete('/delete/:isbn', authLibrarian, deleteBookController)

module.exports = router;
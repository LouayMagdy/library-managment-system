const express = require("express");
const router = express.Router();

const { authLibrarian } = require('../middlewares/auth')
const { addBookController } = require('../controllers/bookControllers');

router.post('/add', authLibrarian, addBookController)

module.exports = router;
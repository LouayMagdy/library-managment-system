const express = require("express");
const router = express.Router();

const { authLibrarian, authUser } = require('../middlewares/auth')
const { addBookController, 
        updateBookController, 
        deleteBookController, 
        getNewerNBooks,
        getOlderNBooks } = require('../controllers/bookControllers');

// book addition route
router.post('/add', authLibrarian, addBookController)
// book update route
router.put('/update', authLibrarian, updateBookController)
// book delete route
router.delete('/delete/:isbn', authLibrarian, deleteBookController)

//book search/list with pagination route
router.get('/newer/:pageSize', authUser, getNewerNBooks)
router.get('/older/:pageSize', authUser, getOlderNBooks)

module.exports = router;
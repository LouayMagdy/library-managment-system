const express = require('express');
const { pool } = require('./config/db');


const app = express();
const PORT = process.env.PORT || 3000;

// Setting a middleware to parse JSON request bodies
app.use(express.json());

// Example route to test database connection
app.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SHOW TABLES;');
        res.json(rows);
    } catch (err) {
        console.error("Database connection error:", err); 
        res.status(500).send('Error accessing database');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
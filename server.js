require('dotenv').config();

const express = require('express');
const bcrypt = require("bcrypt");

const { pool } = require('./config/db');
const { isUserTableEmpty, addUser } = require('./services/accountService')
const userRoutes = require('./routes/userRoutes')

const {handleError} = require("./middlewares/errorHandler")

const app = express();
const PORT = process.env.PORT || 3000;

// Setting a middleware to parse JSON request bodies
app.use(express.json());

// Defining API Routes
app.use("/user", userRoutes);

// Setting a middleware for Custom Error Handling
app.use(handleError);


// Creating a method to setup the server
const startServer = async () => {
    // 1. Checking if there is no users added yet, and add the Admin if so. 
    const isThereNoAdmins = await isUserTableEmpty();
    if(isThereNoAdmins){
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10); // 10 is the salt rounds
        let result = await addUser(process.env.ADMIN_Name, 
                                    process.env.ADMIN_Name, 
                                    process.env.ADMIN_MAIL, 
                                    hashedPassword, 
                                    'admin');
        if(result) console.log("System Admin Added Successfully!\nPlease Change Admin Password ASAP!")
        else{
            console.log("System Admin Cannot be Added right now!");
            process.exit(1);
        }
    }
    else console.log("System Admin Already Added!");
    
    // 2. now, Listen to the port and receive requests 
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();
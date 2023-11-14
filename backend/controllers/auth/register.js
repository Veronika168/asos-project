const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParses = require('body-parser');
const cors = require('cors'); // Import the cors package

router.use(cors());
router.use(bodyParses());

// Provide the correct path to your existing SQLite database file
const db = new sqlite3.Database('././asosDatabase.db');

router.post('/register', async (req, res) => {
    console.log(req.body)
    const { username, email, password, passwordCheck } = req.body;

    if (!username || !email || !password || !passwordCheck) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (password !== passwordCheck) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    let passwordChecks = checkPassword(password)

    if (passwordChecks.isLengthValid === false){
        return res.status(400).json({ message: 'Password must have 12 or more chars' });
    }
    if(passwordChecks.hasUpperCase === false){
        return res.status(400).json({ message: 'Password must have at least 1 upper case char' });
    }
    if(passwordChecks.hasLowerCase === false){
        return res.status(400).json({ message: 'Password must have at least 1 lower case char' });
    }
    if(passwordChecks.hasNumber === false){
        return res.status(400).json({ message: 'Password must have at least 1 number' });
    }

    // Check if the username or email already exists
    const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.all(checkQuery, [username, email], (err, rows) => {
        if (err) {
            console.error('Error checking username/email:', err);
            return res.status(500).json({ message: 'An internal error occurred' });
        }

        if (rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'An internal error occurred' });
            }

            // Insert the user data into the database
            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.run(insertQuery, [username, email, hashedPassword], (err) => {
                if (err) {
                    console.error('Error saving user data:', err);
                    return res.status(500).json({ message: 'An internal error occurred' });
                }

                res.status(200).json({ message: 'Registration successful' });
            });
        });
    });
});

function checkPassword(password){
    const isLengthValid = password.length >= 12
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)

    return{
        isLengthValid,
        hasUpperCase,
        hasLowerCase,
        hasNumber
    };
}


module.exports = router;

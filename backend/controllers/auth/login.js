const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey'; // Replace with a secure secret key

// Create an SQLite database connection
const db = new sqlite3.Database('././asosDatabase.db');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], async (err, row) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ message: 'An internal error occurred' });
        }

        if (!row) {
            return res.status(400).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, row.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create and send an authToken
        const authToken = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ authToken });
    });
});

module.exports = router;

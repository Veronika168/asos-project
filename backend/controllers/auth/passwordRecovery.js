const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");

const router = express.Router();
router.use(cors());
router.use(bodyParser.json());

const db = new sqlite3.Database('././asosDatabase.db');

router.post('/api/password-reset', async (req, res) => {
    const { email } = req.body;

    try {

        db.get('SELECT * FROM users WHERE email = ?', email, async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(404).json({error: 'Database error'});
            }

            if (!user) {
                console.log('User not found');
                return res.status(404).json({error: 'User not found'});
            } else {
                console.log('User found:', user);

                const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                const expirationTime = new Date();
                expirationTime.setHours(expirationTime.getHours() + 1);

                await db.run(`
                    INSERT INTO passwordRecovery (user_id, verification_code, expiration_time)
                    VALUES (?, ?, ?)
                `, user.id, verificationCode, expirationTime.toISOString());

                sendVerificationCodeByEmail(email, verificationCode);

                // Return 200
                res.json({success: true});
            }
        });
    } catch (error) {
        console.error('Error initiating password reset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/api/reset-password', async (req, res) => {
    const { email, verificationCode, newPassword, newPasswordCheck } = req.body;

    try {
        db.get(`
            SELECT *
            FROM passwordRecovery
            WHERE user_id IN (SELECT id FROM users WHERE email = ?)
              AND verification_code = ?
              AND expiration_time > datetime('now')
        `, email, verificationCode, async (err, resetRecord) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            console.log(resetRecord);

            if (!resetRecord) {
                return res.status(400).json({ error: 'Invalid or expired verification code' });
            }

            try {
                // In a production environment, hash the password securely
                // This is just a placeholder, you need to use a proper hashing library

                let passwordChecks = checkPassword(newPassword)

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
                if (newPassword !== newPasswordCheck){
                    return res.status(400).json({ message: 'Passwords are not the same' });
                }

                // Hash the password
                bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res.status(500).json({message: 'An internal error occurred'});
                    }

                    await db.run('UPDATE users SET password = ? WHERE id = ?', hashedPassword, resetRecord.user_id);
                    await db.run('DELETE FROM passwordRecovery WHERE id = ?', resetRecord.id);

                    res.json({success: true});
                });

            } catch (error) {
                console.error('Error updating password:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (error) {
        console.error('Error fetching reset record:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



function sendVerificationCodeByEmail(email, verificationCode) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'asosproject01@gmail.com',
            pass: 'dzbp rrke muiy bwpq', // This should be handled more securely
        },
    });

    const mailOptions = {
        from: 'asosproject01@gmail.com',
        to: email,
        subject: 'Password Reset Verification Code - ASOS PROJECT',
        text: `Your verification code is: ${verificationCode}. Its valid for 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

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

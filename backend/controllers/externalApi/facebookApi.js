const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParses = require('body-parser');
const cors = require('cors');
const axios = require("axios"); // Import the cors package

router.use(cors());
router.use(bodyParses());

const secretKey = 'yourSecretKey'; // Nahraď rovnakým tajným kľúčom, aký si použil pri prihlásení

// Provide the correct path to your existing SQLite database file
const db = new sqlite3.Database('././asosDatabase.db');

router.post('/new/facebook', async (req, res) => {
    const { userId, accessToken } = req.body;
    const pageId = 'ID_OF_PAGE';

    // Funkcia na získanie údajov zo stránky pomocou Facebook API
    async function getPageStatistics() {
        try {
            const response = await axios.get(`https://graph.facebook.com/v13.0/${pageId}`, {
                params: {
                    fields: 'fan_count,posts.limit(10){likes.summary(true),comments.summary(true),shares}',
                    access_token: accessToken,
                },
            });

            const pageData = response.data;
            const { fan_count, posts } = pageData;

            // Uloženie údajov do databázy
            const likes = posts.data.reduce((totalLikes, post) => totalLikes + post.likes.summary.total_count, 0);
            const comments = posts.data.reduce((totalComments, post) => totalComments + post.comments.summary.total_count, 0);
            const shares = posts.data.reduce((totalShares, post) => totalShares + (post.shares ? post.shares.count : 0), 0);

            // Update alebo vloženie údajov do databázy
            db.get(`SELECT id FROM facebookApi WHERE user_id = ?`, [userId], (err, row) => {
                if (err) {
                    console.error('Error checking existing record:', err);
                    res.status(400).send('Error checking existing record.');
                } else {
                    if (row) {
                        // Ak existuje záznam, aktualizuj údaje
                        db.run(
                            `UPDATE facebookApi SET api_token = ?, likes = ?, comments = ?, shares = ?, followers = ? WHERE user_id = ?`,
                            [accessToken, likes, comments, shares, fan_count, userId],
                            function (err) {
                                if (err) {
                                    console.error(err);
                                    res.status(400).send('Error updating data in the database.');
                                } else {
                                    console.log(`Row updated: ${userId}`);
                                    res.status(200).send('Data updated successfully.');
                                }
                            }
                        );
                    } else {
                        // Ak neexistuje záznam, vlož nový záznam
                        db.run(
                            `INSERT INTO facebookApi (user_id, api_token, likes, comments, shares, followers) VALUES (?, ?, ?, ?, ?, ?)`,
                            [userId, accessToken, likes, comments, shares, fan_count],
                            function (err) {
                                if (err) {
                                    console.error(err);
                                    res.status(400).send('Error saving data to the database.');
                                } else {
                                    console.log(`Row inserted: ${this.lastID}`);
                                    res.status(200).send('Data saved successfully.');
                                }
                            }
                        );
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching page statistics:', error.response.data.error);
            res.status(400).send('Error fetching page statistics.');
        }
    }

    getPageStatistics();
});

// GET endpoint na získanie informácií o Facebook API
router.get('/facebookApiData', (req, res) => {
    const { authToken } = req.query; // Prihlasovací token v hlavičke requestu

    console.log(authToken)

    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(authToken, secretKey);

        // Dekódované informácie z JWT, ktoré sme použili na overenie autentifikácie
        const { username } = decoded;

        // Nájdi používateľa v databáze na základe username
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
            if (err) {
                console.error('Error finding user:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (!row) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Ak používateľ existuje, vyhľadaj informácie o Facebook API
            db.get(`SELECT * FROM facebookApi WHERE user_id = ?`, [row.id], (err, facebookRow) => {
                if (err) {
                    console.error('Error finding Facebook API info:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                if (!facebookRow) {
                    return res.status(404).json({ message: 'Facebook API info not found' });
                }

                // Ak všetko prebehlo úspešne, vráť informácie o Facebook API
                return res.status(200).json({ message: 'Facebook API info found', facebookInfo: facebookRow });
            });
        });
    } catch (error) {
        console.error('Error verifying authToken:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

router.get('/new/facebook', async (req, res) => {
    console.log("Ahoojky")
    res.end('Hello, World from /api/new/youtube \n');

});

module.exports = router;
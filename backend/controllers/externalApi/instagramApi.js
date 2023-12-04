const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(cors());
router.use(bodyParser());

const secretKey = 'yourSecretKey'; // Nahraď rovnakým tajným kľúčom, aký si použil pri prihlásení

const db = new sqlite3.Database('././asosDatabase.db');

router.post('/new/instagram', async (req, res) => {
    const { instagramToken, loggedUsername } = req.body;

    // Príklad ID používateľa alebo profilu na Instagrami
    const profileId = '1234567890';

    const api_key = instagramToken;

    async function getProfileStats() {
        const url = `https://api.instagram.com/v1/users/${profileId}/?access_token=${api_key}`;

        try {
            const response = await axios.get(url);
            const data = response.data.data;
            return data;
        } catch (error) {
            console.error('Error fetching profile statistics:', error);
            return null;
        }
    }

    const profileStats = await getProfileStats();

    if (profileStats) {
        const { counts } = profileStats;

        // Find user_id based on username in the users table
        db.get(`SELECT id FROM users WHERE username = ?`, [loggedUsername], (err, row) => {
            if (err) {
                console.error('Error finding user ID:', err);
                res.status(400).send('Error finding user ID.');
            } else {
                if (row) {
                    const { media, follows, followed_by } = counts;
                    const user_id = row.id;

                    // Check if there's a record for the user
                    db.get(`SELECT id FROM instagramApi WHERE user_id = ?`, [user_id], (err, rowInsta) => {
                        if (err) {
                            console.error('Error checking existing record:', err);
                            res.status(400).send('Error checking existing record.');
                        } else {
                            if (rowInsta) {
                                // If record exists, update api_token
                                db.run(
                                    `UPDATE instagramApi SET api_token = ?, impressions = ?, profileViews = ?, followers = ? WHERE user_id = ?`,
                                    [instagramToken, media, follows, followed_by, user_id],
                                    function (err) {
                                        if (err) {
                                            console.log(err);
                                            res.status(400).send('Error updating data in the database.');
                                        } else {
                                            console.log(`Row updated: ${user_id}`);
                                            res.status(200).send('Data updated successfully.');
                                        }
                                    }
                                );
                            } else {
                                // If record doesn't exist, insert a new record
                                db.run(
                                    `INSERT INTO instagramApi (user_id, api_token, impressions, profileViews, followers) VALUES (?, ?, ?, ?, ?)`,
                                    [user_id, instagramToken, media, follows, followed_by],
                                    function (err) {
                                        if (err) {
                                            console.log(err);
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
                } else {
                    console.log('User not found.');
                    res.status(404).send('User not found.');
                }
            }
        });
    } else {
        console.log('Failed to fetch profile statistics.');
        res.status(400).send('Error fetching profile statistics.');
    }
});

router.get('/instagramApiData', (req, res) => {
    const { authToken } = req.query;

    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(authToken, secretKey);
        const { username } = decoded;

        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
            if (err) {
                console.error('Error finding user:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (!row) {
                return res.status(404).json({ message: 'User not found' });
            }

            db.get(`SELECT * FROM instagramApi WHERE user_id = ?`, [row.id], (err, instaRow) => {
                if (err) {
                    console.error('Error finding Instagram API info:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                if (!instaRow) {
                    return res.status(404).json({ message: 'Instagram API info not found' });
                }

                return res.status(200).json({ message: 'Instagram API info found', instagramInfo: instaRow });
            });
        });
    } catch (error) {
        console.error('Error verifying authToken:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;

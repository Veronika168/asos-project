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

// Secret key pre JWT overenie
const secretKey = 'yourSecretKey'; // Nahraď rovnakým tajným kľúčom, aký si použil pri prihlásení

// Provide the correct path to your existing SQLite database file
const db = new sqlite3.Database('././asosDatabase.db');
router.post('/new/youtube', async (req, res) => {
    const { youtubeToken, loggedUsername } = req.body;
    const channel_id = 'UC7_GNgDo85NeNzaEMJ5KSKg'; // ID kanála

    const api_key = youtubeToken;
    console.log(loggedUsername)

    async function getChannelStat() {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channel_id}&key=${api_key}`;

        try {
            const response = await axios.get(url);
            const data = response.data;
            return data.items[0].statistics;
        } catch (error) {
            console.error('Error fetching channel statistics:', error);
            return null;
        }
    }

    const stats = await getChannelStat();

    if (stats) {
        // Uloženie údajov do databázy
        const { viewCount, subscriberCount, videoCount } = stats;

        // Najdi user_id na základe username v tabuľke users
        db.get(`SELECT id FROM users WHERE username = ?`, [loggedUsername], (err, row) => {
            if (err) {
                console.error('Error finding user ID:', err);
                res.status(400).send('Error finding user ID.');
            } else {
                if (row) {
                    const { viewCount, subscriberCount, videoCount } = stats;
                    const user_id = row.id;

                    // Skontroluj, či existuje záznam pre daného používateľa
                    db.get(`SELECT id FROM youtubeApi WHERE user_id = ?`, [user_id], (err, rowYoutube) => {
                        if (err) {
                            console.error('Error checking existing record:', err);
                            res.status(400).send('Error checking existing record.');
                        } else {
                            if (rowYoutube) {
                                // Ak existuje záznam, aktualizuj api_token
                                db.run(
                                    `UPDATE youtubeApi SET api_token = ?, views = ?, subs = ?, videoCount = ? WHERE user_id = ?`,
                                    [youtubeToken, viewCount, subscriberCount, videoCount, user_id],
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
                                // Ak neexistuje záznam, vlož nový záznam
                                db.run(
                                    `INSERT INTO youtubeApi (user_id, api_token, views, subs, videoCount) VALUES (?, ?, ?, ?, ?)`,
                                    [user_id, youtubeToken, viewCount, subscriberCount, videoCount],
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
        console.log('Failed to fetch channel statistics.');
        res.status(400).send('Error fetching channel statistics.');
    }
});

// GET endpoint na získanie informácií o YouTube API
router.get('/youtubeApiData', (req, res) => {
    const { authToken } = req.query; // Prihlasovací token v hlavičke requestu

    console.log(req)
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

            // Ak používateľ existuje, vyhľadaj informácie o YouTube API
            db.get(`SELECT * FROM youtubeApi WHERE user_id = ?`, [row.id], (err, youtubeRow) => {
                if (err) {
                    console.error('Error finding YouTube API info:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                if (!youtubeRow) {
                    return res.status(404).json({ message: 'YouTube API info not found' });
                }

                // Ak všetko prebehlo úspešne, vráť informácie o YouTube API
                return res.status(200).json({ message: 'YouTube API info found', youtubeInfo: youtubeRow });
            });
        });
    } catch (error) {
        console.error('Error verifying authToken:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

router.delete('/delete/youtube', (req, res) => {
    const { authToken } = req.query;

    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(authToken, secretKey);
        const { username } = decoded;

        db.get(`SELECT id FROM users WHERE username = ?`, [username], (err, row) => {
            if (err) {
                console.error('Error finding user ID:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            if (!row) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user_id = row.id;

            db.run(`DELETE FROM youtubeApi WHERE user_id = ?`, [user_id], function (err) {
                if (err) {
                    console.error('Error deleting record:', err);
                    return res.status(500).json({ message: 'Internal Server Error' });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ message: 'Record not found for deletion' });
                }

                return res.status(200).json({ message: 'Record deleted successfully' });
            });
        });
    } catch (error) {
        console.error('Error verifying authToken:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

// Exportuj router
module.exports = router;

router.get('/new/youtube', async (req, res) => {
    console.log("Ahoojky")
    res.end('Hello, World from /api/new/youtube \n');

});


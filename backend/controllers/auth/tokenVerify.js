const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey'; // Replace with the same secret key used for login

router.post('/tokenverify', (req, res) => {
    const { authToken } = req.body;

    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(authToken, secretKey);
        return res.status(200).json({ message: 'Authorized', username: decoded.username });
    } catch (error) {
        console.error('Error verifying authToken:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;

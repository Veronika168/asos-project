const express = require('express');
const router = express.Router();
const axios = require('axios');
const cors = require('cors'); // Import the cors package

router.use(cors());

const APP_ID = '1490024365278945';
const APP_SECRET = 'b1ecd5e9bee882cadffcc34889d08679';
const REDIRECT_URI = 'http://localhost:3001/auth/facebook/callback';

// Initiates the Facebook Login flow
router.get('/auth/facebook', (req, res) => {
    console.log("Facebook auth :)")
    const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email`;
    res.redirect(url);
});

// Callback URL for handling the Facebook Login response
router.get('/auth/facebook/callback', async (req, res) => {
    const { code } = req.query;

    console.log("Sme tu vo facebookAuth !")

    try {
        // Exchange authorization code for access token
        const { data } = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`);

        const { access_token } = data;

        // Use access_token to fetch user profile
        const { data: profile } = await axios.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`);

        console.log(data)
        // console.log(await axios.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`))

        // Tvoje údaje pre autentifikáciu voči Facebooku
        const accessToken = 'EAAVLK1TZCxuEBOZBc5rYKGfEMWEYf2cjGFC2L1nfms9ZBoeOhtfcYYG9NT7VbAVZCpvruKLTRG6oDLgqoPJz5LRya0EfWIX2jCU064j3qeWSL8W0QlMZAHD6FBxW4pD2WvyehumVRzrgCzQsUgUdkwy8znGv89j6GXg8rO5RYs5ZBuybbLeaU9dT4bxzQ5Cxl23ZAwqNp1OLo7mwIyfos6w4t39aA3GZAWm2XVcHz1Tz21fXz1hV7wZAoqc1pN9hqTWY7KwZDZD';
        const fields = 'id,name,email,picture'; // Údaje, ktoré chceš získať

        // URL pre Graph API
        const graphApiUrl = `https://graph.facebook.com/v13.0/me?fields=${fields}&access_token=${accessToken}`;

        // Vykonanie GET požiadavky na Facebook Graph API
        axios.get(graphApiUrl)
            .then(response => {
                console.log(response.data); // Výpis údajov o používateľovi z odpovede
            })
            .catch(error => {
                console.error('Chyba pri vykonaní GET požiadavky:', error);
            });

        res.redirect('/');
    } catch (error) {
        console.error('Error:', error.response.data.error);
        res.redirect('/login');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    // Code to handle user logout
    res.redirect('/login');
});

module.exports = router;


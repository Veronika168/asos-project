const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors'); // Import the cors package

// Include the route logic from auth/register.js
const authRegister = require('./controllers/auth/register');
app.use('/auth', authRegister);

// Use the login route
const authLogin = require('./controllers/auth/login');
app.use('/auth', authLogin);

// Use the tokenverify route
const authTokenVerify = require('./controllers/auth/tokenVerify');
app.use('/auth', authTokenVerify);

// Use the passwordRecovery route
const passwordRecovery = require('./controllers/auth/passwordRecovery');
app.use('/auth', passwordRecovery);

const youtubeApi = require('./controllers/externalApi/youtubeApi');
app.use('/api', youtubeApi);

const facebookApi = require('./controllers/externalApi/facebookApi');
app.use('/api', facebookApi);

const instagramApi = require('./controllers/externalApi/instagramApi');
app.use('/api', instagramApi);

app.use(cors());
// Handle a GET request for the root path ("/") with "Hello, World!"
app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!\n');
    console.log("From server console, Hello stranger!");
});

const server = http.createServer(app);

const port = 3001;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('asosDatabase.db');

// Create a table for users
db.serialize(() => {
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username VARCHAR(255) UNIQUE,
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255)
        );
    `);

    // Create a table for password recovery
    db.run(`
        CREATE TABLE passwordRecovery (
            id INTEGER PRIMARY KEY,
            user_id INTEGER REFERENCES users,
            verification_code VARCHAR,
            expiration_time DATETIME
        );
    `);

    db.run(`
        CREATE TABLE youtubeApi (
            id INTEGER PRIMARY KEY,
            user_id INTEGER REFERENCES users,
            api_token VARCHAR NOT NULL,
            views VARCHAR NOT NULL DEFAULT '0',
            subs VARCHAR NOT NULL DEFAULT '0',
            videoCount VARCHAR NOT NULL DEFAULT '0'
        );
    `);

    db.run(`
        CREATE TABLE facebookApi (
            id INTEGER PRIMARY KEY,
            user_id INTEGER REFERENCES users,
            api_token VARCHAR NOT NULL,
            likes VARCHAR NOT NULL DEFAULT '0',
            comments VARCHAR NOT NULL DEFAULT '0',
            shares VARCHAR NOT NULL DEFAULT '0',
            followers VARCHAR NOT NULL DEFAULT 'O'
        );
    `);

    db.run(`
        CREATE TABLE facebookApi (
            id INTEGER PRIMARY KEY,
            user_id INTEGER REFERENCES users,
            api_token VARCHAR NOT NULL,
            impressions VARCHAR NOT NULL DEFAULT '0',
            profileViews VARCHAR NOT NULL DEFAULT '0',
            followers VARCHAR NOT NULL DEFAULT '0'
        );
    `);
});

db.close();

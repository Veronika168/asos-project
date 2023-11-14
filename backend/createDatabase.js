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
});

db.close();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('asosDatabase.db');

// Create a table
db.serialize(() => {
    db.run("CREATE TABLE users (\n" +
        "    id INTEGER PRIMARY KEY,\n" +
        "    username VARCHAR(255) UNIQUE,\n" +
        "    email VARCHAR(255) UNIQUE,\n" +
        "    password VARCHAR(255)\n" +
        ");\n")
});

db.close();

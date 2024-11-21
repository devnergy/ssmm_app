const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite database
const db = new sqlite3.Database('./ssmm.db', (err) => {
    if (err) {
        console.error("Could not connect to database", err);
    } else {
        console.log("Connected to SQLite database");
    }
});

// Create tables if they don't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount REAL, lane INTEGER, date TEXT)");
});

// Endpoint to login (checks credentials)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the credentials match the hardcoded values
    if (username === "ssmm" && password === "ssmm1237") {
        return res.status(200).json({ message: "Login successful" });
    } else {
        return res.status(400).json({ message: "Invalid credentials" });
    }
});

// Endpoint to add a new record
app.post('/add-record', (req, res) => {
    const { name, amount, lane, date } = req.body;
    
    if (!name || isNaN(amount) || lane < 1 || lane > 10) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const stmt = db.prepare("INSERT INTO records (name, amount, lane, date) VALUES (?, ?, ?, ?)");
    stmt.run(name, amount, lane, date, (err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to add record" });
        }
        res.status(200).json({ message: "Record added successfully" });
    });
});

// Endpoint to get all records
app.get('/records', (req, res) => {
    db.all("SELECT * FROM records", (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Failed to fetch records" });
        }
        res.status(200).json(rows);
    });
});

// Endpoint to search records by name
app.get('/search', (req, res) => {
    const { query } = req.query;
    db.all("SELECT * FROM records WHERE name LIKE ?", [%${query}%], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Search failed" });
        }
        res.status(200).json(rows);
    });
});

// Endpoint to get total collection
app.get('/total-collection', (req, res) => {
    db.get("SELECT SUM(amount) AS total FROM records", (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Failed to calculate total" });
        }
        res.status(200).json({ total: row.total });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
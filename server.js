const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
app.use(bodyParser.json()); // To parse JSON bodies

// Serve static files (like your HTML, CSS, JS files)
app.use(express.static(path.join(__dirname, '/')));

// Create connection to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mg2003',
    database: 'login_register'  // Your existing database name
});

// Connect to database
db.connect(err => {
    if (err) {
        console.log('Unable to connect to database', err.message);
        return;
    }
    console.log('Connected to the database');
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Register route
app.post('/register', (req, res) => {
    const { username, password, phoneNo } = req.body;

    if (!username || !password || !phoneNo) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the user already exists
    const checkQuery = 'SELECT * FROM register WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(409).json({ success: false, message: 'User already exists. Please login.' });
        } else {
            // Insert new user into the existing table
            const insertQuery = 'INSERT INTO register (username, password, phoneNo) VALUES (?, ?, ?)';
    
            db.query(insertQuery, [username, password, phoneNo], (err) => {
                if (err) {
                    console.error('Error inserting user:', err.message);
                    return res.status(500).json({ success: false, message: 'Error registering user' });
                }

                // Registration successful
                res.json({ success: true, message: 'User registered successfully' });
            });
        }
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists with matching password
    const query = 'SELECT * FROM register WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            // Successful login
            res.json({ success: true, message: 'Login successful' });
        } else {
            // Failed login
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

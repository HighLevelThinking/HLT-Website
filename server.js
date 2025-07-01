const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

const app = express();
const saltRounds = 12;

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

const path = require('path');

app.get('/admin.html', (req, res) => {
  if (req.session && req.session.user) {
    res.sendFile(path.join(__dirname, 'admin.html'));
  }
  return res.status(404);
});

const db = new sqlite3.Database('users.db');

// Create table and test user
db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)`);
(async () => {
  const hash = await bcrypt.hash("password", saltRounds);
  db.run("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)", ["trinary", hash]);
})();

app.use(express.static('public'));

app.post('/check-user', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ success: false });
    if (!user) return res.json({ success: false });
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user = { username };
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

app.get('/is-signed-in', (req, res) => {
  res.json({ success: req.session.user });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
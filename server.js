const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const saltRounds = 12;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.14.61:3000'],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,    // false if not using HTTPS
    sameSite: 'lax',  // helps with CORS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.get('/admin.html', (req, res) => {
  if (req.session && req.session.user) {
    return res.sendFile(path.join(__dirname, 'admin.html'));
  }
  return res.status(404).send("Cannot GET /admin.htmlol");
});

app.get('/debug-session', (req, res) => {
  res.json({ session: req.session });
});

const db = new sqlite3.Database('users.db');

// Create table and test user
db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT, email TEXT)`);
(async () => {
  const hash = await bcrypt.hash("password", saltRounds);
  db.run("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)", ["trinary", hash, "lpowyt3@gmail.com"]);
})();

app.use(express.static('public'));

app.post('/check-user', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ success: false });
    if (!user) return res.json({ success: false });
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user = { username: user.username };
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

app.get('/is-signed-in', (req, res) => {
  res.json({ success: !!req.session.user });
});

app.post('/adduser', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username) return res.json({success: false, reason: "Please enter username"});
  if (!password) return res.json({success: false, reason: "Please enter password"});
  if (!email) return res.json({success: false, reason: "Please enter email"});
  if (req.session && req.session.user) {
    db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
      if (err) return res.json({ success: false, reason: "Error: " + err });
      if (user) return res.json({ success: false, reason: "User with username: \"" + username + "\" already exists" });
      const hash = await bcrypt.hash(password, saltRounds);
      db.run("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)", [username, hash, email]);
    });
  }
  return res.json({ success: true})
});

app.listen(3000, '192.168.14.61', () => console.log('Server running on http://192.168.14.61:3000'));
const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const saltRounds = 12;

// Middleware setup
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5500', 'http://127.0.0.1:5500'],
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
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Connect to SQLite DB
const db = new Database('users.db');

// Create table (with new `name` and `level` fields)
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    name TEXT,
    level INTEGER
  )
`).run();

// Create default user
(async () => {
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get("trinary");
  if (!user) {
    const hash = await bcrypt.hash("password", saltRounds);
    db.prepare(`
      INSERT INTO users (username, password, email, name, level)
      VALUES (?, ?, ?, ?, ?)
    `).run("trinary", hash, "lpowyt3@gmail.com", "Logan Kocher", 5);
  }
})();

app.use(express.static('public'));

// Serve admin.html only if signed in
app.get('/admin.html', (req, res) => {
  if (req.session && req.session.user) {
    return res.sendFile(path.join(__dirname, 'admin.html'));
  }
  return res.status(404).send("Cannot GET /admin.html");
});

// Debug route to inspect session
app.get('/debug-session', (req, res) => {
  res.json({ session: req.session });
});

// Login route
app.post('/check-user', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) return res.json({ success: false });

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user = {
        username: user.username,
        level: user.level,
        name: user.name
      };
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Check login status
app.get('/is-signed-in', (req, res) => {
  res.json({ success: !!req.session.user });
});

// Add new user
app.post('/adduser', async (req, res) => {
  const { username, password, email, name, level} = req.body;

  if (!username) return res.json({ success: false, reason: "Please enter username" });
  if (!password) return res.json({ success: false, reason: "Please enter password" });
  if (!email) return res.json({ success: false, reason: "Please enter email" });
  if (!name) return res.json({ success: false, reason: "Please enter name" });
  if (!level) return res.json({ success: false, reason: "Please enter ranking" });

  if (!req.session || !req.session.user.rank > 3) {
    return res.status(403).json({ success: false, reason: "Not authorized" });
  }

  try {
    const existingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (existingUser) {
      return res.json({ success: false, reason: `User with username "${username}" already exists` });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    db.prepare(`
      INSERT INTO users (username, password, email, name, level)
      VALUES (?, ?, ?, ?, ?)
    `).run(username, hash, email, name, level);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, reason: err.message });
  }
});

// Get all users
app.get('/get-users', (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users").all();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/remove-user', (req, res) => {
  const id = req.body;
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    console.warn("Just deleted user ", id, ".");
    res.json({success: true});
  } catch (err) {
    res.json({success: false});
    console.error(err);
  }
});

// Start server
app.listen(5500, '127.0.0.1', () => {
  console.log('Server running on http://127.0.0.1:5500');
});

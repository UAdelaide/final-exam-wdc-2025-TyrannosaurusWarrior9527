const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2/promise');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db;

(async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'DogWalkService'
    });
    console.log('✅ Connected to MySQL');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
})();

// register
app.post('/api/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['owner', 'walker'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const [existing] = await db.execute(
      'SELECT * FROM Users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    await db.execute(
      'INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [users] = await db.execute(
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    if (password!== user.pssword_hash ) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Dog Walking Service API is running.');
});

module.exports = app;
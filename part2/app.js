const express = require('express');
const session = require('express-session')
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const walkRoutes = require('./routes/walkRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// session(stored state)
app.use(session({
  secret: 'dogwalk-secret-key',
  resave: false,
  saveUninitialized: false
}));

// public
app.use(express.static(path.join(__dirname,)))

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
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
app.use(express.static(path.join(__dirname,'public')));

// Routes
app.use('/user', userRoutes);
app.use('/walk', walkRoutes);

// index routes
app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname,'public','index.html'));
});

// Export the app instead of listening here
module.exports = app;
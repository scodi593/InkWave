const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), async (req, res) => {
  // Successful authentication, issue JWT
  const { user, isNewUser } = req.user;
  const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // Set token in cookie
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
  
  // Redirect based on user status
  if (isNewUser) {
    res.redirect(`${process.env.CLIENT_URL}/setup`);
  } else {
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router; 
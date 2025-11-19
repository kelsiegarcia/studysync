const express = require('express');
const router = express.Router();
const passport = require('passport');

// Start Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login-failure' }),
  (req, res) => {
    res.json({ message: 'Authentication successful', user: req.user });
  }
);

router.get('/login-failure', (req, res) => {
  res.status(401).json({ error: 'Failed to authenticate' });
});

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(() => {
      res.json({ message: 'Logged out' });
    });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { verifyJWT } = require('../middleware/authMiddleware');

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

const signupRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: 'Too many accounts created from this IP, please try again after 15 minutes'
});

// Public routes
router.post('/signup', signupRateLimiter, authController.signup);
router.post('/login', loginRateLimiter, authController.login);
router.post('/verify-token', authController.verifyToken);

// Protected routes
router.get('/me', verifyJWT, authController.getCurrentUser);

module.exports = router;

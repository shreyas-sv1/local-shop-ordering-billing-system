const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyJWT } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);

// Protected routes
router.get('/me', verifyJWT, authController.getCurrentUser);

module.exports = router;

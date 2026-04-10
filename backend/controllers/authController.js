const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is missing.");
}

// User Signup
exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    const [existingUsers] = await db.query(checkQuery, [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Automatically set role to customer
    const userRole = 'customer';

    // Create user
    const insertQuery = 'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(insertQuery, [
      email,
      hashedPassword,
      name,
      userRole
    ]);

    const userId = result.insertId;

    // Generate JWT
    const token = jwt.sign(
      { id: userId, email, role: userRole },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId,
        email,
        name,
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await db.query(query, [email]);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Update last login or similar if needed
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = 'SELECT id, email, name, role, created_at FROM users WHERE id = ?';
    const [users] = await db.query(query, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};

// Verify Token
exports.verifyToken = async (req, res) => {
  try {
    const token = req.body.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    return res.status(200).json({
      success: true,
      data: decoded
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

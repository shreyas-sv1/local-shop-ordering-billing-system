const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║   🚀 Grocery Shop Backend Server Started               ║
║   📍 Server: http://localhost:${PORT}               ║
║   📊 API: http://localhost:${PORT}/api               ║
║   🏥 Health: http://localhost:${PORT}/api/health    ║
║                                                        ║
║   Available Endpoints:                                 ║
║   GET  /api/products                 - Get all products║
║   GET  /api/products/:id             - Get product    ║
║   POST /api/products                 - Add product    ║
║   POST /api/orders                   - Create order   ║
║   GET  /api/orders                   - Get all orders ║
║   GET  /api/orders/:id               - Get order      ║
║   GET  /api/orders/stats/count       - Orders count   ║
╚════════════════════════════════════════════════════════╝
  `);
});

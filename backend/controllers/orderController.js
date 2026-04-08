const pool = require('../db');

// Create new order
exports.createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { items } = req.body;
    
    // Validate request
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }
    
    // Start transaction
    await connection.beginTransaction();
    
    let totalAmount = 0;
    
    // Validate all products exist and calculate total
    for (const item of items) {
      const [products] = await connection.query(
        'SELECT price FROM products WHERE id = ?',
        [item.product_id]
      );
      
      if (products.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.product_id} not found`
        });
      }
      
      totalAmount += products[0].price * item.quantity;
    }
    
    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (total_amount, status) VALUES (?, ?)',
      [totalAmount, 'pending']
    );
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      const [products] = await connection.query(
        'SELECT price FROM products WHERE id = ?',
        [item.product_id]
      );
      
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, products[0].price]
      );
    }
    
    // Commit transaction
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: orderId,
      totalAmount: totalAmount
    });
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [orders] = await connection.query(
      'SELECT o.id, o.total_amount, o.status, o.created_at FROM orders o ORDER BY o.created_at DESC'
    );
    connection.release();
    
    res.status(200).json({
      success: true,
      data: orders,
      message: 'Orders fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get order by ID with items
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    // Get order details
    const [orders] = await connection.query(
      'SELECT id, total_amount, status, created_at FROM orders WHERE id = ?',
      [id]
    );
    
    if (orders.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Get order items
    const [items] = await connection.query(
      `SELECT oi.product_id, p.name, oi.quantity, oi.price 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );
    
    connection.release();
    
    res.status(200).json({
      success: true,
      data: {
        ...orders[0],
        items: items
      },
      message: 'Order fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Get orders count (for admin dashboard)
exports.getOrdersCount = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT COUNT(*) as count FROM orders');
    connection.release();
    
    res.status(200).json({
      success: true,
      data: {
        totalOrders: result[0].count
      }
    });
  } catch (error) {
    console.error('Error counting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting orders',
      error: error.message
    });
  }
};

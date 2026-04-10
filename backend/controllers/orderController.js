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
    
    const userId = req.user.id;

    // Start transaction
    await connection.beginTransaction();
    
    let totalAmount = 0;
    const itemPrices = new Map();
    
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
      
      itemPrices.set(item.product_id, products[0].price);
      totalAmount += products[0].price * item.quantity;
    }
    
    // Insert order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, totalAmount, 'pending']
    );
    
    const orderId = orderResult.insertId;
    
    // Insert order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, itemPrices.get(item.product_id)]
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
    let orders;
    if (req.user && req.user.role === 'admin') {
      const [allOrders] = await pool.query(
        'SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at FROM orders o ORDER BY o.created_at DESC'
      );
      orders = allOrders;
    } else {
      const [userOrders] = await pool.query(
        'SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC',
        [req.user.id]
      );
      orders = userOrders;
    }
    
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
    
    // Get order details
    const [orders] = await pool.query(
      'SELECT id, total_amount, status, created_at FROM orders WHERE id = ?',
      [id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Get order items
    const [items] = await pool.query(
      `SELECT oi.product_id, p.name, oi.quantity, oi.price 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

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
    const [result] = await pool.query('SELECT COUNT(*) as count FROM orders');
    
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

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${validStatuses.join(', ')}`
      });
    }

    // Check if order exists
    const [orders] = await pool.query('SELECT id FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status.toLowerCase(), id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      orderId: id,
      newStatus: status.toLowerCase()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Get orders stats (for dashboard)
exports.getOrdersStats = async (req, res) => {
  try {
    // Total orders
    const [totalResult] = await pool.query('SELECT COUNT(*) as count FROM orders');
    
    // Orders by status
    const [statusResult] = await pool.query(
      `SELECT status, COUNT(*) as count FROM orders GROUP BY status`
    );
    
    // Total revenue
    const [revenueResult] = await pool.query(
      'SELECT SUM(total_amount) as totalRevenue FROM orders'
    );

    const stats = {
      totalOrders: totalResult[0].count,
      totalRevenue: revenueResult[0].totalRevenue || 0,
      byStatus: {}
    };

    // Format status counts
    statusResult.forEach(row => {
      stats.byStatus[row.status] = row.count;
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};

// Generate final bill for an order
exports.generateBill = async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { id } = req.params;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bill must contain at least one item'
      });
    }

    // Check if order exists
    const [orders] = await connection.query('SELECT id FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if bill already exists
    const [existingBills] = await connection.query('SELECT id FROM bills WHERE order_id = ?', [id]);
    if (existingBills.length > 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Bill already generated for this order'
      });
    }

    // Start transaction
    await connection.beginTransaction();

    // Calculate final amount from provided items
    let finalAmount = 0;
    for (const item of items) {
      finalAmount += item.quantity * item.price;
    }

    // Update order_items with final prices and quantities
    // First, delete existing order items
    await connection.query('DELETE FROM order_items WHERE order_id = ?', [id]);

    // Insert updated order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [id, item.product_id, item.quantity, item.price]
      );
    }

    // Insert bill record
    const [billResult] = await connection.query(
      'INSERT INTO bills (order_id, final_amount) VALUES (?, ?)',
      [id, finalAmount]
    );

    // Update order with final amount and bill_generated flag
    await connection.query(
      'UPDATE orders SET final_amount = ?, bill_generated = TRUE, status = ? WHERE id = ?',
      [finalAmount, 'ready', id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Bill generated successfully',
      orderId: id,
      billId: billResult.insertId,
      finalAmount: finalAmount
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error generating bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating bill',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Get bill details for customer view
exports.getBillDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    // Get bill info
    const [bills] = await connection.query(
      'SELECT b.id, b.order_id, b.final_amount, b.created_at FROM bills WHERE order_id = ?',
      [id]
    );

    if (bills.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Bill not found for this order'
      });
    }

    // Get bill items
    const [items] = await connection.query(
      `SELECT oi.product_id, p.name, oi.quantity, oi.price, (oi.quantity * oi.price) as subtotal
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    connection.release();

    res.status(200).json({
      success: true,
      data: {
        billId: bills[0].id,
        orderId: bills[0].order_id,
        items: items,
        finalAmount: bills[0].final_amount,
        createdAt: bills[0].created_at
      },
      message: 'Bill details fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching bill details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bill details',
      error: error.message
    });
  }
};

// Get bill generation preview (for admin before generating)
exports.getBillPreview = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    // Get order
    const [orders] = await connection.query('SELECT id, total_amount, bill_generated FROM orders WHERE id = ?', [id]);
    
    if (orders.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (orders[0].bill_generated) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Bill already generated for this order'
      });
    }

    // Get order items for bill preview
    const [items] = await connection.query(
      `SELECT oi.id, oi.product_id, p.name, oi.quantity, oi.price, (oi.quantity * oi.price) as subtotal
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );

    connection.release();

    // Calculate total
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.subtotal;
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: id,
        items: items,
        calculatedTotal: totalAmount,
        originalTotal: orders[0].total_amount
      },
      message: 'Bill preview fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching bill preview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bill preview',
      error: error.message
    });
  }
};

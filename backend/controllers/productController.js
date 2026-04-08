const pool = require('../db');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products');
    connection.release();
    
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    connection.release();
    
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: products[0],
      message: 'Product fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Add new product (admin only - future)
exports.addProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }
    
    const connection = await pool.getConnection();
    const result = await connection.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
    connection.release();
    
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      productId: result[0].insertId
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const connection = await pool.getConnection();
    
    // Check if product exists
    const [products] = await connection.query('SELECT id FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    await connection.query(
      'UPDATE products SET name = ?, price = ? WHERE id = ?',
      [name, price, id]
    );

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      productId: id
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    // Check if product exists
    const [products] = await connection.query('SELECT id FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product
    await connection.query('DELETE FROM products WHERE id = ?', [id]);

    connection.release();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      productId: id
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import '../styles/Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setProducts(data.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Make sure backend is running on http://localhost:5000');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Please add items to cart before proceeding');
      return;
    }

    try {
      // Prepare order data for backend
      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      // Send order to backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Order created successfully
        const orderDataLocal = {
          orderId: result.orderId,
          items: cartItems,
          total: result.totalAmount,
          timestamp: new Date().toLocaleString(),
        };

        // Store in localStorage
        localStorage.setItem('lastOrder', JSON.stringify(orderDataLocal));

        // Log to console
        console.log('Order Placed:', orderDataLocal);

        // Show confirmation
        alert(`Order Placed Successfully!\nOrder ID: ${result.orderId}\nTotal: ₹${result.totalAmount}`);

        // Clear cart
        setCartItems([]);
      } else {
        alert('Error placing order: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Make sure backend is running!');
    }
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="home-container">
      <div className="products-section">
        <h2>Our Products</h2>
        
        {loading && (
          <div className="loading">Loading products from backend...</div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {!loading && !error && (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      <aside className="cart-sidebar">
        <Cart 
          cartItems={cartItems}
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
        />
      </aside>
    </div>
  );
}

export default Home;

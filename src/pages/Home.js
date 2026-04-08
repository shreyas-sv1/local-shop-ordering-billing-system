import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import ProductSearch from '../components/ProductSearch';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { useToast } from '../context/ToastContext';
import '../styles/Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { success, error: showError } = useToast();

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
          setFilteredProducts(data.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        const errorMsg = 'Failed to load products. Make sure backend is running on http://localhost:5000';
        setError(errorMsg);
        showError(errorMsg);
        setLoading(false);
      });
  }, [showError]);

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
      showError('Please add items to cart before proceeding');
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

        // Show success notification
        success(`Order Placed Successfully! Order ID: ${result.orderId}`);

        // Clear cart
        setCartItems([]);
      } else {
        showError('Error placing order: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Failed to place order. Make sure backend is running!');
    }
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="home-container">
      <div className="products-section">
        <h2>Our Products</h2>
        
        {loading ? (
          <Loader size="large" message="Loading products from backend..." />
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <ProductSearch 
              products={products}
              onFilteredProducts={setFilteredProducts}
            />
            
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon="🔍"
                title="No Products Found"
                message="Try adjusting your search or filters"
              />
            )}
          </>
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

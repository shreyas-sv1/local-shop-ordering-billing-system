import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import products from '../data/products';
import '../styles/Home.css';

function Home() {
  const [cartItems, setCartItems] = useState([]);

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

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Please add items to cart before proceeding');
      return;
    }

    const orderData = {
      items: cartItems,
      total: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      timestamp: new Date().toLocaleString(),
    };

    // Store in localStorage
    localStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Log to console
    console.log('Order Placed:', orderData);

    // Show confirmation
    alert('Order Placed Successfully!\nTotal: ₹' + orderData.total);

    // Clear cart
    setCartItems([]);
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="home-container">
      <div className="products-section">
        <h2>Our Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
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

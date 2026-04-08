import React from 'react';
import '../styles/Navbar.css';

function Navbar({ cartCount, onAdminClick, onOrdersClick }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">🛒 Grocery Shop</h1>
        <div className="navbar-right">
          <button className="orders-btn" onClick={onOrdersClick}>
            📋 My Orders
          </button>
          <button className="admin-access-btn" onClick={onAdminClick}>
            👨‍💼 Admin
          </button>
          <div className="navbar-cart">
            <span className="cart-label">Cart Items: </span>
            <span className="cart-count">{cartCount}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

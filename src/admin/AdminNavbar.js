import React, { useEffect, useState } from 'react';
import '../admin/styles/AdminNavbar.css';

function AdminNavbar({ activeTab, onTabChange, onExit }) {
  return (
    <div className="admin-navbar">
      <div className="admin-navbar-container">
        <h1 className="admin-logo">📊 Shop Owner Dashboard</h1>
        <nav className="admin-nav">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            📈 Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => onTabChange('orders')}
          >
            📦 Orders
          </button>
          <button
            className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => onTabChange('products')}
          >
            🛒 Products
          </button>
          <button
            className={`nav-btn logout-btn`}
            onClick={onExit}
          >
            🚪 Exit Admin
          </button>
        </nav>
      </div>
    </div>
  );
}

export default AdminNavbar;

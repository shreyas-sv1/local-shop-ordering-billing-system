import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar({ onAdminClick, onOrdersClick }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">🛒 Grocery Shop</h1>
        <div className="navbar-right">
          {isAuthenticated && user ? (
            <>
              <button className="orders-btn" onClick={onOrdersClick}>
                📋 My Orders
              </button>
              <button className="admin-access-btn" onClick={onAdminClick}>
                👨‍💼 Admin
              </button>
              <div className="navbar-user">
                <span className="user-greeting">👤 {user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            </>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              🔐 Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

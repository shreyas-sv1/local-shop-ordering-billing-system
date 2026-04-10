import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar({ cartItemCount = 0 }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  const goHome = () => {
    navigate('/');
  };

  const goOrders = () => {
    navigate('/orders');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo" onClick={goHome} style={{cursor: 'pointer'}}>🛒 Local Shop</h1>
        <div className="navbar-right">
          {isAuthenticated && user ? (
            <>
              {cartItemCount > 0 && (
                <span className="cart-badge">🛒 {cartItemCount}</span>
              )}
              <button className="orders-btn" onClick={goOrders}>
                📋 My Orders
              </button>
              {user.role === 'admin' && (
                <button className="admin-access-btn" onClick={goToAdmin}>
                  👨‍💼 Admin Panel
                </button>
              )}
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

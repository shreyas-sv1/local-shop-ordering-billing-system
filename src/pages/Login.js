import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../utils/api';
import '../styles/Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginRole, setLoginRole] = useState('customer'); // 'customer' or 'admin'
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        const userRole = data.data.role || 'customer';
        
        if (loginRole === 'admin' && userRole !== 'admin') {
          showError('Access denied. You are not an admin.');
          setLoading(false);
          return;
        }

        login(data.data);
        success('Login successful! Redirecting...');
        
        setTimeout(() => {
          if (userRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        showError(data.message);
      }
    } catch (err) {
      showError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container theme-${loginRole}`}>
      <div className="auth-form-wrapper">
        <div className="role-toggle-container">
          <button 
            type="button" 
            className={`role-toggle-btn ${loginRole === 'customer' ? 'active' : ''}`}
            onClick={() => setLoginRole('customer')}
          >
            🛒 Customer Sign In
          </button>
          <button 
            type="button" 
            className={`role-toggle-btn admin-btn ${loginRole === 'admin' ? 'active' : ''}`}
            onClick={() => setLoginRole('admin')}
          >
            🛡️ Admin Portal
          </button>
        </div>

        <div className="auth-header">
          <h1>{loginRole === 'admin' ? '🛡️ Admin Login' : '🔐 Customer Login'}</h1>
          <p>{loginRole === 'admin' ? 'Access the store management dashboard' : 'Welcome back to Local Shop'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
              className={loginRole === 'admin' ? 'admin-input' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className={loginRole === 'admin' ? 'admin-input' : ''}
            />
          </div>

          <button type="submit" className={`auth-btn ${loginRole === 'admin' ? 'admin-submit-btn' : ''}`} disabled={loading}>
            {loading ? '⏳ Logging in...' : '✓ Login'}
          </button>
        </form>

        {loginRole === 'customer' && (
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;

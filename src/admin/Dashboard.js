import React, { useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';
import '../admin/styles/Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiFetch('/orders/stats/all');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard stats');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>📦 Total Orders</h3>
          <p className="stat-value">{stats?.totalOrders || 0}</p>
        </div>

        <div className="stat-card">
          <h3>💰 Total Revenue</h3>
          <p className="stat-value">₹{stats?.totalRevenue || 0}</p>
        </div>

        <div className="stat-card">
          <h3>⏳ Pending</h3>
          <p className="stat-value">{stats?.byStatus?.pending || 0}</p>
        </div>

        <div className="stat-card">
          <h3>✅ Accepted</h3>
          <p className="stat-value">{stats?.byStatus?.accepted || 0}</p>
        </div>

        <div className="stat-card">
          <h3>👨‍🍳 Preparing</h3>
          <p className="stat-value">{stats?.byStatus?.preparing || 0}</p>
        </div>

        <div className="stat-card">
          <h3>🎉 Ready</h3>
          <p className="stat-value">{stats?.byStatus?.ready || 0}</p>
        </div>

        <div className="stat-card">
          <h3>🏁 Completed</h3>
          <p className="stat-value">{stats?.byStatus?.completed || 0}</p>
        </div>
      </div>

      <div className="dashboard-info">
        <h3>📊 Order Status Workflow</h3>
        <div className="workflow">
          <span>Pending</span>
          <span>→</span>
          <span>Accepted</span>
          <span>→</span>
          <span>Preparing</span>
          <span>→</span>
          <span>Ready</span>
          <span>→</span>
          <span>Completed</span>
        </div>
      </div>

      <div className="dashboard-welcome">
        <p>👋 Welcome to your shop admin panel!</p>
        <p>Use the navigation above to manage orders and products.</p>
      </div>
    </div>
  );
}

export default Dashboard;

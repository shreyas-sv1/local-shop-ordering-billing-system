import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Products from './Products';
import './styles/AdminPanel.css';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleExit = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'products':
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-panel">
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} onExit={handleExit} />
      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminPanel;

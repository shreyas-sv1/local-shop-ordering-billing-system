import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Products from './Products';
import './styles/AdminPanel.css';

function AdminPanel({ onExit }) {
  const [activeTab, setActiveTab] = useState('dashboard');

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
      <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} onExit={onExit} />
      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminPanel;

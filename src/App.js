import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OrderHistory from './pages/OrderHistory';
import AdminPanel from './admin/AdminPanel';
import { ToastProvider } from './context/ToastContext';
import './styles/App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'orders'

  const handleAdminAccess = () => {
    setIsAdminMode(!isAdminMode);
  };

  const handleViewOrders = () => {
    setCurrentPage('orders');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  if (isAdminMode) {
    return <AdminPanel onExit={handleAdminAccess} />;
  }

  return (
    <ToastProvider>
      <div className="App">
        <Navbar 
          cartCount={cartCount} 
          onAdminClick={handleAdminAccess}
          onOrdersClick={handleViewOrders}
        />
        <main className="main-content">
          {currentPage === 'home' ? (
            <Home />
          ) : (
            <OrderHistory />
          )}
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './admin/AdminPanel';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/App.css';

function AppContent() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const { isAuthenticated } = useAuth();

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
    <>
      <Navbar 
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
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

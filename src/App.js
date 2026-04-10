import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './admin/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/App.css';

// Admin Protected Route
function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  
  return children;
}

// Protected Route 
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } />
              
              <Route path="/orders" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <main className="main-content">
                      <OrderHistory />
                    </main>
                  </>
                </ProtectedRoute>
              } />

              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

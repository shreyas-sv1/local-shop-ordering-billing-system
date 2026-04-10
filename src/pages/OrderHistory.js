import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerBill from '../components/CustomerBill';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { apiFetch } from '../utils/api';
import '../styles/OrderHistory.css';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      const response = await apiFetch('/orders');
      const data = await response.json();

      if (data.success) {
        // Sort orders by date (newest first)
        const sortedOrders = data.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sortedOrders);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      accepted: '✓',
      preparing: '👨‍🍳',
      ready: '🎉',
      completed: '🏁'
    };
    return icons[status] || '📦';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      accepted: '#17a2b8',
      preparing: '#ffc107',
      ready: '#28a745',
      completed: '#007bff'
    };
    return colors[status];
  };

  const handleViewBill = (orderId) => {
    setSelectedOrderId(orderId);
    setShowBill(true);
  };

  if (loading) {
    return (
      <div className="order-history-container">
        <h2>📋 My Orders</h2>
        <Loader size="large" message="Loading your orders..." />
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <div className="oh-header">
        <h2>📋 My Orders</h2>
        <p className="oh-subtitle">View your order history and bills</p>
      </div>

      {error && (
        <div className="error-box">
          <span className="error-icon">❌</span>
          <span>{error}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState 
          icon="📭"
          title="No Orders Yet"
          message="You haven't placed any orders yet. Start shopping now!"
          actionText="Continue Shopping"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="orders-grid-customer">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="card-header">
                <div className="order-id">Order #{order.id}</div>
                <div 
                  className="status-badge-customer" 
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusIcon(order.status)} {order.status}
                </div>
              </div>

              <div className="card-content">
                <div className="info-row">
                  <span className="label">Amount:</span>
                  <span className="value">₹{order.total_amount}</span>
                </div>

                {order.bill_generated && order.final_amount && (
                  <div className="info-row billed-row">
                    <span className="label">Final Bill:</span>
                    <span className="value amount-highlight">₹{order.final_amount}</span>
                  </div>
                )}

                <div className="info-row">
                  <span className="label">Date:</span>
                  <span className="value">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value">
                    {order.status === 'completed' ? '✓ Order Completed' : 
                     order.status === 'ready' ? '🎉 Ready for Pickup' :
                     order.status === 'preparing' ? '👨‍🍳 Being Prepared' :
                     order.status === 'accepted' ? '✓ Accepted' :
                     '⏳ Pending'}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                {order.bill_generated ? (
                  <button 
                    className="btn-view-bill"
                    onClick={() => handleViewBill(order.id)}
                  >
                    📄 View Bill
                  </button>
                ) : (
                  <div className="no-bill-notice">
                    Waiting for shop owner to generate bill...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showBill && selectedOrderId && (
        <CustomerBill 
          orderId={selectedOrderId}
          onClose={() => setShowBill(false)}
        />
      )}
    </div>
  );
}

export default OrderHistory;

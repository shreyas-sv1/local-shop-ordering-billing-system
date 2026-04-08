import React, { useEffect, useState } from 'react';
import '../admin/styles/Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
        alert(`Order ${orderId} status updated to ${newStatus}`);
      } else {
        alert('Error updating status: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedOrder(data.data);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-container">
      <h2>Order Management</h2>

      <div className="orders-layout">
        <div className="orders-list-section">
          <h3>All Orders ({orders.length})</h3>
          
          {orders.length === 0 ? (
            <p className="no-orders">No orders found</p>
          ) : (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className={`order-row status-${order.status}`}>
                      <td className="order-id">#{order.id}</td>
                      <td className="order-amount">₹{order.total_amount}</td>
                      <td className="order-status">
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="order-date">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="order-action">
                        <button 
                          className="view-btn"
                          onClick={() => fetchOrderDetails(order.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedOrder && (
          <div className="order-details-section">
            <div className="order-details-header">
              <h3>Order #{selectedOrder.id} Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="order-details-content">
              <div className="detail-group">
                <h4>Order Items</h4>
                <div className="items-list">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-group">
                <h4>Total Amount</h4>
                <p className="total-amount">₹{selectedOrder.total_amount}</p>
              </div>

              <div className="detail-group">
                <h4>Order Status</h4>
                <div className="status-update">
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                    disabled={updatingOrderId === selectedOrder.id}
                    className="status-select"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="accepted">✓ Accepted</option>
                    <option value="preparing">👨‍🍳 Preparing</option>
                    <option value="ready">🎉 Ready</option>
                    <option value="completed">🏁 Completed</option>
                  </select>
                  {updatingOrderId === selectedOrder.id && (
                    <span className="updating">Updating...</span>
                  )}
                </div>
              </div>

              <div className="detail-group">
                <h4>Order Date</h4>
                <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;

import React, { useState } from 'react';
import '../styles/Checkout.css';

function Checkout() {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const lastOrder = localStorage.getItem('lastOrder');
  const order = lastOrder ? JSON.parse(lastOrder) : null;

  const handlePlaceOrder = () => {
    if (order) {
      setOrderConfirmed(true);
      setTimeout(() => {
        alert('Order Placed Successfully!');
        window.location.href = '/';
      }, 2000);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      {!order ? (
        <div className="no-order">
          <p>No items in cart. Please add items before checkout.</p>
        </div>
      ) : (
        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-total">
            <h3>Total Amount: ₹{order.total}</h3>
            <p>Order Date: {order.timestamp}</p>
          </div>

          {!orderConfirmed && (
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Confirm Order
            </button>
          )}

          {orderConfirmed && (
            <div className="confirmation-message">
              ✓ Order Confirmed! Thank you for your purchase.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Checkout;

import React from 'react';
import EmptyState from './EmptyState';
import '../styles/Cart.css';

function Cart({ cartItems, onRemoveItem, onUpdateQuantity, onCheckout }) {
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="cart-empty-state">
          <EmptyState 
            icon="🛒"
            title="Cart is Empty"
            message="Add some products to your cart to get started"
          />
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                </div>
                <div className="item-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button 
                    className="remove-btn"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Total: ₹{totalPrice}</h3>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;

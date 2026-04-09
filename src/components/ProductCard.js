import React, { useState } from 'react';
import '../styles/ProductCard.css';

const getCategoryEmoji = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('milk') || lower.includes('dairy')) return '🥛';
  if (lower.includes('bread') || lower.includes('bun')) return '🍞';
  if (lower.includes('egg')) return '🥚';
  if (lower.includes('rice')) return '🍚';
  if (lower.includes('tomato')) return '🍅';
  if (lower.includes('onion')) return '🧅';
  if (lower.includes('dal') || lower.includes('bean') || lower.includes('chana') || lower.includes('lentil') || lower.includes('sprout')) return '🫘';
  if (lower.includes('pea')) return '🫛';
  if (lower.includes('jaggery') || lower.includes('sugar')) return '🍯';
  if (lower.includes('soap')) return '🧼';
  if (lower.includes('biscuit') || lower.includes('cookie') || lower.includes('good day')) return '🍪';
  if (lower.includes('flour')) return '🌾';
  if (lower.includes('salt')) return '🧂';
  if (lower.includes('tea')) return '🍵';
  if (lower.includes('coffee')) return '☕';
  if (lower.includes('oil')) return '🍾';
  return '🛍️';
};

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.price);

  const handleQuantityChange = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val) || val < 0) val = 0;
    setQuantity(val);
    setPrice(+(val * product.price).toFixed(2));
  };

  const handlePriceChange = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val) || val < 0) val = 0;
    setPrice(val);
    setQuantity(+(val / product.price).toFixed(3));
  };

  const handleAddClick = () => {
    if (quantity > 0) {
      onAddToCart(product, quantity);
      setQuantity(1);
      setPrice(product.price);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">{getCategoryEmoji(product.name)}</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price} <span className="unit-label">/ unit</span></p>
      
      <div className="purchase-controls">
        <div className="input-group">
          <label>Qty:</label>
          <input 
            type="number" 
            step="0.05" 
            min="0" 
            value={quantity || ''} 
            onChange={handleQuantityChange} 
            className="card-input qty-input"
          />
        </div>
        <span className="divider">=</span>
        <div className="input-group">
          <label>₹:</label>
          <input 
            type="number" 
            step="1" 
            min="0" 
            value={price || ''} 
            onChange={handlePriceChange} 
            className="card-input price-input"
          />
        </div>
      </div>

      <button className="add-to-cart-btn" onClick={handleAddClick}>
        Add to Cart (₹{price})
      </button>
    </div>
  );
}

export default ProductCard;

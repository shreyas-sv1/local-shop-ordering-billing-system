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

  const handleQuantityChange = (e) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val) || val < 0) val = 0;
    setQuantity(val);
  };

  const handleAddClick = () => {
    if (quantity > 0) {
      onAddToCart(product, quantity);
      setQuantity(1);
    }
  };

  const getUnitString = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('(1kg)') || lower.includes('(500g)') || lower.includes('kg') || lower.includes('gram')) return '';
    if (lower.includes('(1l)') || lower.includes('(500ml)') || lower.includes('litre') || lower.includes('ml')) return '';
    if (lower.includes('(1 piece)') || lower.includes('piece')) return '';
    return '';
  };
  
  const unitStr = getUnitString(product.name);

  return (
    <div className="product-card">
      <div className="product-image">{getCategoryEmoji(product.name)}</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price} {unitStr && <span className="unit-label">{unitStr}</span>}</p>
      
      <div className="purchase-controls">
        <div className="input-group">
          <label>Qty:</label>
          <input 
            type="number" 
            step="1" 
            min="0" 
            value={quantity || ''} 
            onChange={handleQuantityChange} 
            className="card-input qty-input"
          />
        </div>
      </div>

      <button className="add-to-cart-btn" onClick={handleAddClick}>
        Add to Cart (₹{(quantity * product.price).toFixed(2)})
      </button>
    </div>
  );
}

export default ProductCard;

import React from 'react';
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
  return (
    <div className="product-card">
      <div className="product-image">{getCategoryEmoji(product.name)}</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;

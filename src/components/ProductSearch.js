import React, { useState, useMemo } from 'react';
import '../styles/ProductSearch.css';

function ProductSearch({ products, onFilteredProducts }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [products, searchTerm]);

  // Notify parent component of filtered products
  React.useEffect(() => {
    if (onFilteredProducts) {
      onFilteredProducts(filteredProducts);
    }
  }, [filteredProducts, onFilteredProducts]);

  return (
    <div className="product-search-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search products (milk, rice, eggs...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="search-clear"
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="search-results">
        <span className="results-count">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </span>
      </div>
    </div>
  );
}

export default ProductSearch;

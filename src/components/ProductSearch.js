import React, { useState, useMemo } from 'react';
import '../styles/ProductSearch.css';

function ProductSearch({ products, onFilteredProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Get unique categories from products
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category || 'Other'))];
  }, [products]);

  // Filter products based on search and categories
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category || 'Other');

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategories]);

  // Notify parent component of filtered products
  React.useEffect(() => {
    if (onFilteredProducts) {
      onFilteredProducts(filteredProducts);
    }
  }, [filteredProducts, onFilteredProducts]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };

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

      {categories.length > 0 && (
        <div className="filter-section">
          <div className="filter-header">
            <span className="filter-label">Categories</span>
            {selectedCategories.length > 0 && (
              <button 
                className="filter-reset"
                onClick={handleReset}
              >
                Reset
              </button>
            )}
          </div>
          <div className="category-filters">
            {categories.map(category => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                />
                <span className="checkbox-label">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="search-results">
        <span className="results-count">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </span>
      </div>
    </div>
  );
}

export default ProductSearch;

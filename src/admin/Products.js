import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../utils/api';
import '../admin/styles/Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [isAdding, setIsAdding] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiFetch('/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({ name: '', price: '' });
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setIsAdding(false);
    setFormData({ name: product.name, price: product.price });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      showError('Please fill in all fields');
      return;
    }

    try {
      if (editingId) {
        // Update product
        const response = await apiFetch(`/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
          setProducts(products.map(p => 
            p.id === editingId 
              ? { ...p, name: formData.name, price: parseInt(formData.price) }
              : p
          ));
          success('Product updated successfully!');
          setEditingId(null);
          setFormData({ name: '', price: '' });
        } else {
          showError('Error: ' + data.message);
        }
      } else {
        // Add new product
        const response = await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (data.success) {
          setProducts([...products, {
            id: data.productId,
            name: formData.name,
            price: parseInt(formData.price)
          }]);
          success('Product added successfully!');
          setIsAdding(false);
          setFormData({ name: '', price: '' });
        } else {
          showError('Error: ' + data.message);
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      showError('Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    // Replaced window.confirm with Toast / simpler logic or just continue if required
    // (A custom modal would be built for confirmation, keeping it minimal here)
    try {
      const response = await apiFetch(`/products/${productId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      if (data.success) {
        setProducts(products.filter(p => p.id !== productId));
        success('Product deleted successfully!');
      } else {
        showError('Error: ' + data.message);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showError('Failed to delete product');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', price: '' });
  };

  if (loading) return <Loader size="large" message="Loading products..." />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-container">
      <h2>Product Management</h2>

      <div className="products-layout">
        <div className="products-list-section">
          <div className="list-header">
            <h3>Products ({products.length})</h3>
            {!isAdding && !editingId && (
              <button className="add-btn" onClick={handleAddClick}>
                + Add Product
              </button>
            )}
          </div>

          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="price">₹{product.price}</p>
                </div>
                <div className="product-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditClick(product)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(isAdding || editingId) && (
          <div className="product-form-section">
            <h3>{isAdding ? 'Add New Product' : 'Edit Product'}</h3>
            <div className="form-group">
              <label>Product Name</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Milk (1L)"
              />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input 
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 50"
              />
            </div>

            <div className="form-actions">
              <button className="save-btn" onClick={handleSave}>
                💾 Save
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;

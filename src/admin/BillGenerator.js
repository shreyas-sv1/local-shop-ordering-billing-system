import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import './styles/BillGenerator.css';

function BillGenerator({ orderId, onBillGenerated, onCancel }) {
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [generating, setGenerating] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchBillPreview();
  }, [orderId]);

  const fetchBillPreview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/bill-preview`);
      const data = await response.json();

      if (data.success) {
        // Convert items to editable format
        const editableItems = data.data.items.map(item => ({
          ...item,
          quantity: item.quantity,
          price: item.price
        }));
        setBillItems(editableItems);
        setCalculatedTotal(data.data.calculatedTotal);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch bill preview: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    const updatedItems = [...billItems];
    updatedItems[index].quantity = quantity;
    setBillItems(updatedItems);
    recalculateTotal(updatedItems);
  };

  const handlePriceChange = (index, newPrice) => {
    const price = parseInt(newPrice) || 0;
    const updatedItems = [...billItems];
    updatedItems[index].price = price;
    setBillItems(updatedItems);
    recalculateTotal(updatedItems);
  };

  const recalculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setCalculatedTotal(total);
  };

  const handleGenerateBill = async () => {
    try {
      setGenerating(true);
      setError('');

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/generate-bill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: billItems
        })
      });

      const data = await response.json();

      if (data.success) {
        success(`Bill generated successfully! Final Amount: ₹${data.data.finalAmount}`);
        onBillGenerated();
      } else {
        setError(data.message);
        showError(data.message);
      }
    } catch (err) {
      const errorMsg = 'Failed to generate bill: ' + err.message;
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="bill-generator-modal">
        <div className="bill-generator-content">
          <Loader size="large" message="Loading bill items..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bill-generator-modal">
      <div className="bill-generator-content">
        <div className="bg-header">
          <h2>📄 Generate Bill - Order #{orderId}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        {error && <div className="error-message">❌ {error}</div>}

        <div className="bill-items-section">
          <div className="bill-items-header">
            <span className="col-name">Product Name</span>
            <span className="col-qty">Quantity</span>
            <span className="col-price">Unit Price (₹)</span>
            <span className="col-subtotal">Subtotal (₹)</span>
          </div>

          {billItems.map((item, index) => (
            <div key={index} className="bill-item-row">
              <div className="col-name">{item.name}</div>
              <input
                type="number"
                className="col-qty input-field"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                min="1"
              />
              <input
                type="number"
                className="col-price input-field"
                value={item.price}
                onChange={(e) => handlePriceChange(index, e.target.value)}
                min="0"
              />
              <div className="col-subtotal">{(item.quantity * item.price).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="bill-summary">
          <div className="summary-row">
            <span className="label">Total Items:</span>
            <span className="value">{billItems.length}</span>
          </div>
          <div className="summary-row total-row">
            <span className="label">Final Bill Amount:</span>
            <span className="value amount">₹ {calculatedTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bill-actions">
          <button
            className="btn btn-cancel"
            onClick={onCancel}
            disabled={generating}
          >
            Cancel
          </button>
          <button
            className="btn btn-generate"
            onClick={handleGenerateBill}
            disabled={generating || billItems.length === 0}
          >
            {generating ? '⏳ Generating...' : '✓ Generate Bill'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillGenerator;

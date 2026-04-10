import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../utils/api';
import './styles/BillGenerator.css';

function BillGenerator({ orderId, onBillGenerated, onCancel }) {
  const [billItems, setBillItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [generating, setGenerating] = useState(false);
  const { success, error: showError } = useToast();
  const billRef = useRef();

  useEffect(() => {
    fetchBillPreview();
  }, [orderId]);

  const fetchBillPreview = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/orders/${orderId}/bill-preview`);
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

      const response = await apiFetch(`/orders/${orderId}/generate-bill`, {
        method: 'POST',
        body: JSON.stringify({
          items: billItems
        })
      });

      const data = await response.json();

      if (data.success) {
        success(`Bill generated successfully! Final Amount: ₹${data.finalAmount}`);
        
        // Generate PDF using html2pdf
        const element = billRef.current;
        
        // Ensure hidden elements are visible for PDF generation
        element.classList.add('printing');
        
        const opt = {
          margin: 10,
          filename: `Invoice-Order-${orderId}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).save();
        
        element.classList.remove('printing');
        
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

        <div className="bill-container-print" ref={billRef}>
          {/* Printable Header - hidden by default, visible only in PDF */}
          <div className="print-only">
            <h2 className="shop-title">🛒 Local Shop Invoice</h2>
            <div className="bill-meta-info">
              <div className="info-box">
                <p><strong>Order ID:</strong> #{orderId}</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            <hr />
          </div>

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
                  className="col-qty input-field hide-print"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  min="1"
                />
                <span className="col-qty print-only-inline">{item.quantity}</span>
                <input
                  type="number"
                  className="col-price input-field hide-print"
                  value={item.price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  min="0"
                />
                <span className="col-price print-only-inline">₹{item.price}</span>
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

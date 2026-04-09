import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './styles/CustomerBill.css';

function CustomerBill({ orderId, onClose }) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const billRef = useRef(null);

  useEffect(() => {
    fetchBill();
  }, [orderId]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/bill`);
      const data = await response.json();

      if (data.success) {
        setBill(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch bill: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-bill-modal">
        <div className="bill-content">
          <div className="loading">⏳ Loading bill...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-bill-modal">
        <div className="bill-content">
          <div className="error">❌ {error}</div>
          <button className="close-btn-simple" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  if (!bill) {
    return null;
  }

  const printBill = () => {
    window.print();
  };

  const downloadPDF = () => {
    if (!billRef.current) return;

    const element = billRef.current;
    const opt = {
      margin: 10,
      filename: `bill-order-${bill.orderId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="customer-bill-modal">
      <div className="bill-content">
        <div className="bill-header">
          <h1>📄 Bill Receipt</h1>
          <button className="close-btn-modal" onClick={onClose}>✕</button>
        </div>

        <div className="bill-container" ref={billRef}>
          {/* Header Section */}
          <div className="receipt-header">
            <h2 className="shop-name">🛒 Local Shop</h2>
            <p className="receipt-subtext">Order Bill Receipt</p>
          </div>

          {/* Order Details Section */}
          <div className="bill-section">
            <div className="section-row">
              <span className="label">Order ID:</span>
              <span className="value">#{bill.orderId}</span>
            </div>
            <div className="section-row">
              <span className="label">Bill ID:</span>
              <span className="value">#{bill.billId}</span>
            </div>
            <div className="section-row">
              <span className="label">Date:</span>
              <span className="value">{new Date(bill.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Items Section */}
          <div className="bill-section items-section">
            <h3 className="section-title">Order Items</h3>
            
            <div className="items-header">
              <span className="col-name">Item</span>
              <span className="col-qty">Qty</span>
              <span className="col-price">Price</span>
              <span className="col-total">Total</span>
            </div>

            {bill.items && bill.items.length > 0 ? (
              bill.items.map((item, index) => (
                <div key={index} className="item-row-bill">
                  <span className="col-name">{item.name}</span>
                  <span className="col-qty">{item.quantity}</span>
                  <span className="col-price">₹{item.price}</span>
                  <span className="col-total">₹{item.subtotal}</span>
                </div>
              ))
            ) : (
              <div className="item-row-bill">
                <p>No items in this order</p>
              </div>
            )}

            <div className="divider"></div>
          </div>

          {/* Total Section */}
          <div className="bill-section total-section">
            <div className="total-row">
              <span className="label">Final Bill Amount:</span>
              <span className="amount">₹{bill?.finalAmount || bill?.final_amount || 0}</span>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bill-footer">
            <p>Thank you for shopping with us! ✨</p>
            <p className="footer-note">Please keep this receipt for your records</p>
          </div>

          {/* Action Buttons */}
          <div className="bill-actions print-hide">
            <button className="btn-download-pdf" onClick={downloadPDF}>
              📥 Download PDF
            </button>
            <button className="btn-print" onClick={printBill}>
              🖨️ Print Bill
            </button>
            <button className="btn-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerBill;

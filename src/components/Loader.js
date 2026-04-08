import React from 'react';
import '../styles/Loader.css';

function Loader({ size = 'medium', message = '' }) {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="spinner"></div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
}

export default Loader;

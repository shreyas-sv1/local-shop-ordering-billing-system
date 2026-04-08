import React from 'react';
import '../styles/EmptyState.css';

function EmptyState({ icon = '📦', title, message, actionText, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {actionText && onAction && (
        <button className="empty-action-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

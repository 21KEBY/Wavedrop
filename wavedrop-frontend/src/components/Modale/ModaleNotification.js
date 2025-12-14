import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import './ModaleNotification.css';

const ModaleNotification = ({ type = 'success', message, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} />;
      case 'error':
        return <XCircle size={24} />;
      case 'warning':
        return <AlertCircle size={24} />;
      default:
        return <CheckCircle size={24} />;
    }
  };

  return (
    <div className="modale-notification-overlay" onClick={onClose}>
      <div className={`modale-notification ${type}`} onClick={(e) => e.stopPropagation()}>
        <button className="btn-fermer-notification" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="notification-icone">
          {getIcon()}
        </div>
        <p className="notification-message">{message}</p>
      </div>
    </div>
  );
};

export default ModaleNotification;

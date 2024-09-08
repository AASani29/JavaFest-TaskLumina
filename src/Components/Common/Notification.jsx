import React from 'react';
import '../CSS Files/Notification.css';

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification-popup">
      <div className="notification-message">
        {message}
      </div>
      <button className="notification-close" onClick={onClose}>Close</button>
    </div>
  );
};

export default Notification;

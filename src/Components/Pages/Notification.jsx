import React from 'react';
import '../CSS Files/Notification.css';

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <span>{message}</span>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Notification;

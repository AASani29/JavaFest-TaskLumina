// src/components/NotificationDropdown.js
import React from 'react';
import '../CSS Files/Notification.css';

const NotificationDropdown = ({ notifications, onCloseNotification }) => {
  return (
    <div className="notification-dropdown">
      {notifications.length === 0 ? (
        <div className="notification-empty">No new notifications</div>
      ) : (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <span>{notification}</span>
            <button onClick={() => onCloseNotification(index)}>Close</button>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationDropdown;

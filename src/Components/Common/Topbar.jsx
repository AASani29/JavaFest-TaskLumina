import React, { useEffect, useState } from "react";
import "../CSS Files/Achievements.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { getMyProfile, getNotifications } from "./user-service";
import { getCurrentUser } from "./Auth";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const Topbar = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      fetchNotifications();
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await getMyProfile();
      if (response.statusCode === 200) {
        setUserProfile(response.ourUsers);
      } else {
        console.error("Failed to fetch user profile:", response.message);
      }
    } catch (error) {
      console.error(
        "Error occurred while fetching user profile:",
        error.message
      );
    }
  };

  const handleCloseNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };
  const fetchNotifications = async () => {
    try {
      const storedNotifications = await getNotifications(); // Fetch stored notifications from the backend
      setNotifications(
        storedNotifications.map((notification) => notification.message)
      );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  return (
    <div>
      <header className="topbar">
        <div className="icon-container">
          <FontAwesomeIcon
            icon={faBell}
            className="bell-icon"
            onClick={handleBellClick}
          />
          <div className="profile-info">
            {userProfile ? (
              <span
                className="user-name"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                {userProfile.name}
              </span>
            ) : (
              <span>Loading...</span>
            )}
          </div>
          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              onCloseNotification={handleCloseNotification}
            />
          )}
        </div>
      </header>
    </div>
  );
};

export default Topbar;

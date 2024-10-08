import React, { useState, useEffect } from "react";
import {
  getMyProfile,
  getNotifications,
  getAchievements,
} from "../Common/user-service";
import "../CSS Files/ProfilePage.css";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../Common/Auth";
import Avatar1 from "../Assets/Avatar/Avatar1.jpg";
import Medal from "../Assets/medal_404647.png";
import { BiEdit } from "react-icons/bi";
import Sidebar from "../Common/Sidebar";
import Topbar from "../Common/Topbar";

const loadScript = (src, async = true, defer = true) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = async;
    script.defer = defer;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("avatar1.png"); // default avatar

  const badgeDescriptions = {
    "Rookie Starter": "Earned by completing first task of the month",
    "Daily Achiever": "Earned by completing all tasks in a single day.",
    "Weekly Warrior":
      "Earned by completing all tasks every day for a full week.",
    "Monthly Master":
      "Earned by completing all tasks every day for a full month.",
    "Consistent Performer":
      "Earned by completing at least one task every day for 15 consecutive days.",
    "Task Marathoner": "Earned by completing 10 tasks in a single day.",
    "Weekend Warrior":
      "Earned by completing all tasks on both Saturday and Sunday.",
    "Early Bird": "Earned by completing the first task of the day before 9 AM.",
  };

  const allBadges = [
    "Rookie Starter",
    "Daily Achiever",
    "Weekly Warrior",
    "Monthly Master",
    "Consistent Performer",
    "Task Marathoner",
    "Weekend Warrior",
    "Early Bird",
  ];

  const fetchAchievements = async (userId) => {
    try {
      const data = await getAchievements(userId);
      setAchievements(data || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    }
  };

  const isBadgeEarned = (badge) => {
    return achievements.some(
      (achievement) =>
        achievement.badge.trim().toLowerCase() === badge.trim().toLowerCase()
    );
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      fetchUserProfile();
      fetchAchievements(user.id);
      fetchNotifications();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await getMyProfile();
      if (response.statusCode === 200) {
        const { email, name, city } = response.ourUsers;
        setUserProfile({ email, name, city });
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCloseNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const fetchNotifications = async () => {
    try {
      const storedNotifications = await getNotifications();
      setNotifications(
        storedNotifications.map((notification) => notification.message)
      );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Filter earned badges
  const earnedBadges = allBadges.filter((badge) => isBadgeEarned(badge));

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="content">
        <Topbar />
        <div className="hero-today1">
          <h2>My Profile</h2>
        </div>
        <div className="profilepage-content">
          <div className="avatar-section">
            <img
              src={Avatar1}
              alt="Selected Avatar"
              className="profile-avatar"
            />
            <div className="avatarbutton">
              <div className="profile-section">
                <div className="profile-details-section">
                  <div className="profile-details-item">
                    <label>Profile name:</label>
                    <input
                      type="text"
                      value={userProfile ? userProfile.name : ""}
                      readOnly
                    />
                  </div>
                  <div className="profile-details-item">
                    <label>Username:</label>
                    <input
                      type="text"
                      value={userProfile ? userProfile.email : ""}
                      readOnly
                    />
                  </div>
                  <div className="buttons">
                    <div className="profile-logout">
                      <button onClick={handleLogout}>Logout</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <BiEdit className="editbutton" />
          </div>

          <div className="profile-container">
            <div className="badges-section">
              <div className="badges-header">
                <h3>Earned Badges</h3>
              </div>
              <div className="badge-list">
                {earnedBadges.length > 0 ? (
                  earnedBadges.map((badge, index) => (
                    <div className="badge-item" key={index}>
                      <img src={Medal} alt="Badge Medal" />
                      <div className="badge-title">{badge}</div>
                      <div className="badge-description">
                        {badgeDescriptions[badge] ||
                          "No description available."}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No badges earned yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

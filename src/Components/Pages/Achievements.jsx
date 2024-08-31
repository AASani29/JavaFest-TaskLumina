import React, { useEffect, useState } from 'react';
import '../CSS Files/Achievements.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faCalendarDays, faClock, faList, faCirclePlus, faBell, faGamepad, faMedal } from '@fortawesome/free-solid-svg-icons';
import { FiPlusCircle , FiClock, FiCalendar } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { SlBadge } from "react-icons/sl";
import { MdOutlineToday } from "react-icons/md";
import { getAchievements, getMyProfile, getNotifications } from '../user-service';
import { getCurrentUser } from '../Auth';
import Logo from "../Assets/Logo.png";
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from '../Features/NotificationDropdown';

const loadScript = (src, async = true, defer = true) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const Achievements = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const fetchAchievements = async (userId) => {
    try {
      const data = await getAchievements(userId);
      setAchievements(data || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getMyProfile();
      if (response.statusCode === 200) {
        setUserProfile(response.ourUsers);
      } else {
        console.error('Failed to fetch user profile:', response.message);
      }
    } catch (error) {
      console.error('Error occurred while fetching user profile:', error.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const storedNotifications = await getNotifications(); // Fetch stored notifications from the backend
      setNotifications(storedNotifications.map(notification => notification.message));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const loadBotpressScripts = async () => {
      try {
        await loadScript("https://cdn.botpress.cloud/webchat/v1/inject.js");
        await loadScript("https://mediafiles.botpress.cloud/6f06300e-840b-4711-b2ac-8e9d5f7d4bf5/webchat/config.js");
      } catch (error) {
        console.error("Failed to load Botpress scripts:", error);
      }
    };

    loadBotpressScripts();
  }, []);

  const badgeDescriptions = {
    'Rookie Starter': 'Earned by completing first task of the month',
    'Daily Achiever': 'Earned by completing all tasks in a single day.',
    'Weekly Warrior': 'Earned by completing all tasks every day for a full week.',
    'Monthly Master': 'Earned by completing all tasks every day for a full month.',
    'Consistent Performer': 'Earned by completing at least one task every day for 15 consecutive days.',
    'Task Marathoner': 'Earned by completing 10 tasks in a single day.',
    'Weekend Warrior': 'Earned by completing all tasks on both Saturday and Sunday.',
    'Early Bird': 'Earned by completing the first task of the day before 9 AM.'
};


const allBadges = ['Rookie Starter', 'Daily Achiever', 'Weekly Warrior', 'Monthly Master', 'Consistent Performer', 'Task Marathoner', 'Weekend Warrior', 'Early Bird'];


  const isBadgeEarned = (badge) => {
    return achievements.some((achievement) => achievement.badge === badge);
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="logo-container" onClick={() => navigate('/dashboard')} >
          <img src={Logo} alt="Logo" className="logo1" />
        </div>
        <ul className="sidebar-features">
          <li>
            <div className="sidebar-button" onClick={() => navigate('/dashboard')}>
            <MdOutlineToday  className="circle-icon" />
              <span>Today</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/viewtodolist')}>
              <FontAwesomeIcon icon={faList} className="circle-icon" />
              <span>View Todo List</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/routine')}>
            <FiClock  className="circle-icon" />
              <span>Make Me a Routine</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/scheduleanevent')}>
            <FiCalendar icon={faCalendarDays} className="circle-icon" />
              <span>Schedule an Event</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button-slected">
            <SlBadge icon={faAward} className="circle-icon" />
              <span color='#1C4D53'>View Achievements</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/games')}>
            <IoGameControllerOutline icon={faGamepad} className="circle-icon" />
              <span>Play a Game</span>
            </div>
          </li>
        </ul>
      </nav>
      <main className="content">
        <header className="topbar">
          <div className="icon-container">
            <FontAwesomeIcon icon={faBell} className="bell-icon" onClick={handleBellClick} />
            <div className="profile-info">
              {userProfile ? (
                <span className="user-name" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
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
        <div className='time'>
          Achievements
        </div>
        <div className='achievements-container'>
          <div className='badge-list'>
            {allBadges.map((badge, index) => (
              <div
                className={`achievement-item ${isBadgeEarned(badge) ? 'earned' : ''}`}
                key={index}
              >
                <div className='achievement-header'>
                  <FontAwesomeIcon icon={faMedal} className={`medal-icon ${isBadgeEarned(badge) ? 'earned' : ''}`} />
                  <span className={`achievement-name ${isBadgeEarned(badge) ? 'earned' : ''}`}>{badge}</span>
                </div>
                <div className={`achievement-description ${isBadgeEarned(badge) ? 'earned' : ''}`}>
                  {badgeDescriptions[badge]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Achievements;

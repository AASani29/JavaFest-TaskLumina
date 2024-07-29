import React, { useEffect, useState } from 'react';
import '../CSS Files/Achievements.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faCalendarDays, faClock, faList, faCirclePlus, faBell, faGamepad, faMedal } from '@fortawesome/free-solid-svg-icons';
import { getAchievements, getMyProfile } from '../user-service';
import { getCurrentUser } from '../Auth';
import Logo from "../Assets/Logo.png";
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      fetchUserProfile();
      fetchAchievements(user.id);
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
    'Monthly Master': 'Earned by completing all tasks every day for a full month.'
  };

  const allBadges = ['Rookie Starter', 'Daily Achiever', 'Weekly Warrior', 'Monthly Master'];

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
              <FontAwesomeIcon icon={faCirclePlus} className="circle-icon" />
              <span>Today's Tasks</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/viewtodolist')}>
              <FontAwesomeIcon icon={faList} className="circle-icon" />
              <span>View Todo List</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button">
              <FontAwesomeIcon icon={faClock} className="circle-icon" />
              <span>Make Me a Routine</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/scheduleanevent')}>
              <FontAwesomeIcon icon={faCalendarDays} className="circle-icon" />
              <span>Schedule an Event</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button">
              <FontAwesomeIcon icon={faAward} className="circle-icon" />
              <span>View Achievements</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/games')}>
              <FontAwesomeIcon icon={faGamepad} className="circle-icon" />
              <span>Play a Game</span>
            </div>
          </li>
        </ul>
      </nav>
      <main className="content">
        <header className="topbar">
          <div className="icon-container">
            <FontAwesomeIcon icon={faBell} className="bell-icon" />
            <div className="profile-info">
              {userProfile ? (
                <span className="user-name" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                  {userProfile.name}
                </span>
              ) : (
                <span>Loading...</span>
              )}
            </div>
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

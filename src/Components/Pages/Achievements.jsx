import React, { useEffect, useState } from 'react';
import '../CSS Files/Achievements.css'; // Import the same CSS file to use the same styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faCalendarDays, faClock, faList, faCirclePlus, faBell, faGamepad, faMedal } from '@fortawesome/free-solid-svg-icons';
import { getAchievements } from '../user-service'; // Adjust import path if necessary
import Logo from "../Assets/Logo.png";
import { useNavigate } from 'react-router-dom';
import { getMyProfile, getTasks } from '../user-service';
import { getCurrentUser } from '../Auth';

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
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            navigate("/login");
            console.log("Not logged in, userData missing");
        } else {
            fetchTodayTasks();
            fetchUserProfile();
            fetchAchievements(user.id);
        }
    }, [navigate]);

    const fetchAchievements = async (userId) => {
        try {
            const data = await getAchievements(userId);
            console.log("Fetched achievements:", data); // Debugging line
            setAchievements(data || []); // Ensure data is an array
        } catch (error) {
            console.error("Failed to fetch achievements:", error);
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

    const fetchTodayTasks = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            console.log("Today's date:", today); // Debugging line
            const data = await getTasks();
            console.log("Fetched tasks:", data); // Debugging line

            const todayTasks = data.filter(task => {
                const taskDate = new Date(task.dateTime);
                if (isNaN(taskDate.getTime())) {
                    console.log(`Invalid date for task: ${task.name}, Task Date: ${task.dateTime}`); // Debugging line
                    return false;
                }
                const taskDateFormatted = taskDate.toISOString().split('T')[0];
                console.log(`Task: ${task.name}, Task Date: ${taskDateFormatted}, Is Today: ${taskDateFormatted === today}`); // Debugging line
                return taskDateFormatted === today && !task.completed;
            });

            setTasks(todayTasks);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const badgeDescriptions = {
        'Rookie Starter': 'Earned by completing first task of the month',
        'Daily Achiever': 'Earned by completing all tasks in a single day.',
        'Weekly Warrior': 'Earned by completing all tasks every day for a full week.',
        'Monthly Master': 'Earned by completing all tasks every day for a full month.'
    };

    const badgeProgress = {
        'Rookie Starter': 30, // Example progress percentage
        'Daily Achiever': 60, // Example progress percentage
        'Weekly Warrior': 80, // Example progress percentage
        'Monthly Master': 50  // Example progress percentage
    };

    const badgeNames = ['Rookie Starter', 'Daily Achiever', 'Weekly Warrior', 'Monthly Master'];

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
                            <span>Todays Tasks</span>
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
                        <div className="sidebar-button">
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
                <div className='achievements'>
                    Achievements
                </div>
                <div className='achievements-container'>
                    <div className='column'>
                        {badgeNames.slice(0, 2).map((badge, index) => (
                            <div className='achievement-item' key={index}>
                                <div className='achievement-header'>
                                    <FontAwesomeIcon icon={faMedal} className='medal-icon' />
                                    <span className='achievement-name'>{badge}</span>
                                </div>
                                <div className='achievement-description'>
                                    {badgeDescriptions[badge]}
                                </div>
                                <div className='progress-container'>
                                    <div
                                        className='progress-bar'
                                        style={{ width: `${badgeProgress[badge]}%` }} // Dynamically set width
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='column'>
                        {badgeNames.slice(2).map((badge, index) => (
                            <div className='achievement-item' key={index}>
                                <div className='achievement-header'>
                                    <FontAwesomeIcon icon={faMedal} className='medal-icon' />
                                    <span className='achievement-name'>{badge}</span>
                                </div>
                                <div className='achievement-description'>
                                    {badgeDescriptions[badge]}
                                </div>
                                <div className='progress-container'>
                                    <div
                                        className='progress-bar'
                                        style={{ width: `${badgeProgress[badge]}%` }} // Dynamically set width
                                    ></div>
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

import React, { useEffect, useState } from 'react';
import '../CSS Files/Dashboard.css'; // Import the same CSS file to use the same styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faCalendarDays, faClock, faTag, faList, faCirclePlus, faBell, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { getAchievements } from '../user-service'; // Adjust import path if necessary
import Logo from "../Assets/Logo.png";
import { useNavigate } from 'react-router-dom';
import { getMyProfile, getTasks } from '../user-service';
import { getCurrentUser } from '../Auth';

const Achievements = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [error, setError] = useState('');
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
            setError("Failed to fetch achievements");
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
                <div className='time'>
                    Achievements
                </div>
                <div className='task_added'>
                    <div className="profile-details">
                        {achievements.length > 0 ? (
                            achievements.map((achievement, index) => (
                                <div className='eachtask' key={index}>
                                    <div className='eventname'>
                                        <span className='span'>
                                            <label className='achievement-task'>{achievement.badge}</label>
                                        </span>
                                    </div>
                                    <div className='description'>
                                        {achievement.date}
                                    </div>
                                    <div className='locationandtime'>
                                        <span className='span'>
                                            <FontAwesomeIcon icon={faTag} className='location-icon' />
                                            {achievement.badge}
                                        </span>
                                        <span className='span'>
                                            <FontAwesomeIcon icon={faClock} className='location-icon' />
                                            {new Date(achievement.date).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No achievements found.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Achievements;

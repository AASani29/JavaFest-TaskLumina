import React, { useState, useEffect } from 'react';
import { getMyProfile } from '../user-service'; // Import getMyProfile function from userService
import '../CSS Files/ProfilePage.css'; // Import your CSS file for styling
import { useNavigate} from 'react-router-dom';
import '../CSS Files/Dashboard.css';
import Logo from "../Assets/Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCirclePlus, faList, faCalendarDays, faAward, faGamepad} from '@fortawesome/free-solid-svg-icons';

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
const ProfilePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
   // State to store user profile
   const [showAddTaskForm, setShowAddTaskForm] = useState(false);
   const [tasks, setTasks] = useState([]);
   const [editTask, setEditTask] = useState(null);
   const [todayDate, setTodayDate] = useState('');
  const toggleAddTaskForm = () => {
    setEditTask(null);
    setShowAddTaskForm(!showAddTaskForm);
  };
  useEffect(() => {
    fetchUserProfile(); // Fetch user profile on component mount
  }, []);
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
      const response = await getMyProfile(); // Fetch user profile using userService function
      if (response.statusCode === 200) {
        // Destructure only required fields from response.ourUsers
        const { email, name, city } = response.ourUsers;
        // Set user profile in state with only required fields
        setUserProfile({ email, name, city });
      } else {
        // Handle error scenario
        console.error('Failed to fetch user profile:', response.message);
        // Example: You can display an error message or handle as needed
      }
    } catch (error) {
      console.error('Error occurred while fetching user profile:', error.message);
      // Example: You can display an error message or handle as needed
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage on logout
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo1" />
        </div>
        <ul className="sidebar-features">
          <li>
            <div className="sidebar-button" onClick={toggleAddTaskForm}>
              <FontAwesomeIcon icon={faCirclePlus} className="circle-icon" />
              <span>Add Task</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/dashboard')}>
              <FontAwesomeIcon icon={faList} className="circle-icon" />
              <span>Todays Tasks</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/routine')}>
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
            <div className="sidebar-button" onClick={() => navigate('/achievements')}>
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
      
      
      <main className='content'>
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
            
           
            {/* <FontAwesomeIcon icon={faUser} className="user-icon" onClick={handleLogout} style={{ cursor: 'pointer' }} /> */}
          </div>
        </header>
        <div className='time'>
        My Profile
        </div>
        <div className='task_added'>
        {userProfile ? (
        <div className="profile-details">
          <div className='details'>
            <label>Name:</label>
            <span>{userProfile.name}</span>
          </div>
          <div className='details'>
            <label>Email:</label>
            <span>{userProfile.email}</span>
          </div>
          
          <div className='details'>
            <label>City:</label>
            <span>{userProfile.city}</span>
          </div>
          <div >
          <span className="user-icon" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</span>
          </div>

          {/* Exclude displaying password as per requirement */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      </div>
        </main>

          

    </div>
    
  );
};

export default ProfilePage;

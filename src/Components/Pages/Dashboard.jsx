import React, { useState, useEffect } from 'react';
import '../CSS Files/Dashboard.css';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import AddTaskForm from '../Features/AddTaskForm';
import Logo from "../Assets/Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCirclePlus, faList, faCalendarDays, faAward, faGamepad, faComment, faPlus, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../Auth';
import { getTasks, deleteTask } from '../user-service';
import { getMyProfile } from '../user-service'; // Import getMyProfile function from userService

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current location
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [todayDate, setTodayDate] = useState('');
  const [userProfile, setUserProfile] = useState(null); // State to store user profile

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      console.log("Not logged in, userData missing");
    } else {
      fetchTodayTasks();
      fetchUserProfile(); // Fetch user profile on component mount
    }
  }, [navigate]);

  useEffect(() => {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    setTodayDate(formattedDate);
  }, []);

  const fetchTodayTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log("Today's date:", today); // Debugging line
      const data = await getTasks();
      console.log("Fetched tasks:", data); // Debugging line
  
      // Filter tasks for today's date
      const todayTasks = data.filter(task => {
        const taskDate = new Date(task.dateTime);
        if (isNaN(taskDate)) {
          console.log(`Invalid date for task: ${task.name}, Task Date: ${task.dateTime}`); // Debugging line
          return false;
        }
        const taskDateFormatted = taskDate.toISOString().split('T')[0];
        console.log(`Task: ${task.name}, Task Date: ${taskDateFormatted}, Is Today: ${taskDateFormatted === today}`); // Debugging line
        return taskDateFormatted === today;
      });
  
      setTasks(todayTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getMyProfile(); // Fetch user profile using userService function
      if (response.statusCode === 200) {
        setUserProfile(response.ourUsers); // Set user profile in state
      } else {
        console.error('Failed to fetch user profile:', response.message);
      }
    } catch (error) {
      console.error('Error occurred while fetching user profile:', error.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowAddTaskForm(true);
  };

  const toggleAddTaskForm = () => {
    setEditTask(null);
    setShowAddTaskForm(!showAddTaskForm);
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
        <ul>
          <li>
            <div className={`sidebar-button ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={toggleAddTaskForm}>
              <FontAwesomeIcon icon={faCirclePlus} className="circle-icon" />
              <span>Add Task</span>
              {location.pathname === '/dashboard' && <span className="arrow-sign">{'>'}</span>} {/* Indicator */}
            </div>
          </li>
          <li>
            <div className={`sidebar-button ${location.pathname === '/viewtodolist' ? 'active' : ''}`} onClick={() => navigate('/viewtodolist')}>
              <FontAwesomeIcon icon={faList} className="circle-icon" />
              <span>View Todo List</span>
              {location.pathname === '/viewtodolist' && <span className="arrow-sign">{'>'}</span>} {/* Indicator */}
            </div>
          </li>
          <li>
            <div className={`sidebar-button ${location.pathname === '/dashboard' ? 'active' : ''}`} >
              <FontAwesomeIcon icon={faClock} className="circle-icon" />
              <span>Make Me a Routine</span>
              {location.pathname === '/dashboard' && <span className="arrow-sign">{'>'}</span>} {/* Indicator */}
            </div>
          </li>
          <li>
            <div className={`sidebar-button ${location.pathname === '/scheduleanevent' ? 'active' : ''}`} onClick={() => navigate('/scheduleanevent')}>
              <FontAwesomeIcon icon={faCalendarDays} className="circle-icon" />
              <span>Schedule an Event</span>
              {location.pathname === '/scheduleanevent' && <span className="arrow-sign">{'>'}</span>} {/* Indicator */}
            </div>
          </li>
          <li>
            <div className={`sidebar-button ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <FontAwesomeIcon icon={faAward} className="circle-icon" />
              <span>View Achievements</span>
              {location.pathname === '/dashboard' && <span className="arrow-sign">{'>'}</span>} {/* Indicator */}
            </div>
          </li>
          <li>
            <div className={`sidebar-button ${location.pathname === '/dashboard' ? 'active' : ''}`} >
              <FontAwesomeIcon icon={faGamepad} className="circle-icon" />
              <span>Play a Game</span>
              {location.pathname === '/dashboard' && <span className="arrow-sign">{'>'}</span>} {/* Indicator */}
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
            <FontAwesomeIcon icon={faUser} className="user-icon" onClick={handleLogout} style={{ cursor: 'pointer' }} />
          </div>
        </header>
        <div className='time'>
          Today
        </div>
        <div className='present_time'>
          {todayDate}
        </div>
        <div className='task_added'>
          {tasks.length === 0 ? "No task added yet" : (
            <ul>
              {tasks.map(task => (
                <li key={task.id}>
                  {task.name} - {task.description}
                  <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                  <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="add-task-button" onClick={toggleAddTaskForm}>
          <FontAwesomeIcon icon={faPlus} className="add-task-icon" />
          <span>Add Task</span>
        </div>
        <div className="chat-button-container">
          <FontAwesomeIcon icon={faComment} className="chat-icon flip-horizontal" />
        </div>
        {showAddTaskForm && <AddTaskForm toggleForm={toggleAddTaskForm} editTask={editTask} />} {/* Conditionally render the AddTaskForm */}
      </main>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import '../CSS Files/Dashboard.css';
import '../CSS Files/ScheduleAnEvent.css';
import Notification from '../Pages/Notification';
import NotificationDropdown from '../Features/NotificationDropdown';
import { useNavigate } from 'react-router-dom';
import AddTaskForm from '../Features/AddTaskForm';
import Logo from "../Assets/Logo.png";
import Calendar from "../Assets/299092_calendar_icon.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClock, faFilter, faCirclePlus, faList, faCalendarDays, faAward, faTag, faGamepad, faEdit, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../Auth';
import { getTasks, completeTask, getTaskProgress, updateProgress, getMyProfile, getMyRewards, markRewardAsNotified, getNotifications } from '../user-service';
import { FaRegSmileBeam } from "react-icons/fa";
import { FiPlusCircle , FiClock, FiCalendar, Fi } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { SlBadge } from "react-icons/sl";
import MiniCalendar from '../Features/MiniCalendar';
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
const TaskCard = ({ task, onEdit, onComplete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'green';
      case 'MEDIUM': return 'purple';
      case 'LOW': return 'black';
      default: return 'black';
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-name" style={{ color: getPriorityColor(task.priority) }}>
          {task.name}
        </div>
        <div className="task-icons">
          <div className="task-icon-card" onClick={() => onEdit(task)}>
            <FontAwesomeIcon icon={faEdit} className="task-icon-edit" />
          </div>
          <div className="task-icon-card" onClick={() => onComplete(task.id)}>
            <FontAwesomeIcon icon={faTrash} className="task-icon-done" />
          </div>
        </div>
      </div>
      <div className="task-description">
        <p>{task.description}</p>
      </div>
      <div className="task-body">
        <div className="task-details">
          <span className="task-card-item">
            {new Date(task.dateTime).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            {new Date(task.dateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </span>
          <span className="task-card-item">{task.category}</span>
          <span className="task-card-item">{task.priority}</span>
          <button className="task-done-button" onClick={() => onComplete(task.id)}>
            Mark as completed
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewTodoList = () => {
  const navigate = useNavigate();
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [todayDate, setTodayDate] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [popupNotifications, setPopupNotifications] = useState([]);
  const [hasNotified, setHasNotified] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const notificationsFetchedRef = useRef(false);
  const [showDueTasks, setShowDueTasks] = useState(true);
  const [showUpcomingTasks, setShowUpcomingTasks] = useState(true);
  
  
  const toggleDueTasks = () => setShowDueTasks(!showDueTasks);
const toggleUpcomingTasks = () => setShowUpcomingTasks(!showUpcomingTasks);


  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      fetchAllTasks();
      fetchUserProfile();
      fetchTaskProgress();
      if (!notificationsFetchedRef.current) {
        fetchAndCheckRewards();
        fetchStoredNotifications();
        notificationsFetchedRef.current = true;
      }
    }
  }, [navigate]);

  useEffect(() => {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    setTodayDate(formattedDate);
  }, []);

  const fetchAllTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch all tasks:", error);
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

  const fetchTaskProgress = async () => {
    try {
      const progressData = await getTaskProgress();
      setProgress((progressData.completedTasks / progressData.totalTasks) * 100);
    } catch (error) {
      console.error('Failed to fetch task progress:', error);
    }
  };

  const fetchAndCheckRewards = async () => {
    try {
      const rewards = await getMyRewards();
      const newRewards = rewards.filter(reward => !reward.notified);

      if (newRewards.length > 0 && !hasNotified) {
        const notificationMessages = newRewards.map(reward => `You have earned the ${reward.badge} reward!`);
        setNotifications(notificationMessages);
        setPopupNotifications(notificationMessages);
        setHasNotified(true);

        for (const reward of newRewards) {
          await markRewardAsNotified(reward.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch rewards:", error);
    }
  };

  const fetchStoredNotifications = async () => {
    try {
      const storedNotifications = await getNotifications();
      setNotifications(storedNotifications.map(notification => notification.message));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      const progressData = await fetchTaskProgress();
      await updateProgress(progressData);
      setProgress((progressData.completedTasks / progressData.totalTasks) * 100);
    } catch (error) {
      console.error("Failed to complete task:", error);
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

  const handleFilterChange = (event) => {
    setFilterCriteria(event.target.value);
    applyFilter(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setFilterCategory(event.target.value);
  };

  const applyFilter = (criteria) => {
    let sortedTasks = [...tasks];
    if (criteria === 'priority') {
      sortedTasks.sort((a, b) => {
        const priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    } else if (criteria === 'time') {
      sortedTasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    }
    setTasks(sortedTasks);
  };

  const getFilteredTasksByCategory = () => {
    if (filterCategory === 'ALL') {
      return tasks;
    }
    return tasks.filter(task => task.category === filterCategory);
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  const handlePopupClose = (index) => {
    setPopupNotifications(popupNotifications.filter((_, i) => i !== index));
  };

  const getDueTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return getFilteredTasksByCategory().filter(task => {
      const taskDate = new Date(task.dateTime).toISOString().split('T')[0];
      return taskDate < today && !task.completed;
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return getFilteredTasksByCategory().filter(task => {
      const taskDate = new Date(task.dateTime).toISOString().split('T')[0];
      return taskDate >= today && !task.completed;
    });
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="logo-container" onClick={() => navigate('/dashboard')}>
          <img src={Logo} alt="Logo" className="logo1" />
        </div>
        <ul className="sidebar-features">
          <li>
            <div className="sidebar-button" onClick={toggleAddTaskForm}>
              <FiPlusCircle icon={faCirclePlus} className="circle-icon" />
              <span>Add Task</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/dashboard')}>
              <FontAwesomeIcon icon={faList} className="circle-icon" />
              <span>Today's Tasks</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button">
              <FiClock icon={faClock} className="circle-icon" />
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
            <div className="sidebar-button" onClick={() => navigate('/achievements')}>
              <SlBadge icon={faAward} className="circle-icon" />
              <span>View Achievements</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/games')}>
              <IoGameControllerOutline icon={faGamepad} className="circle-icon" />
              <span>Play A Game</span>
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
          </div>
          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              onCloseNotification={handleCloseNotification}
            />
          )}
        </header>
        <div className='Hero'>
          <div className='hero-today'>
            All Tasks
          </div>
          <div className='filters'>
          <div className='filter'>
            <label htmlFor="filter">Filter:   </label>
            <select id="filter" value={filterCriteria} onChange={handleFilterChange}>
              <option value="">Select Filter&nbsp;&nbsp;&nbsp;   </option>
              <option value="priority">Priority</option>
              <option value="time">Time</option>
            </select>
          </div>
          <div className='category-filter'>
            <label htmlFor="categoryFilter">Category: </label>
            <select id="categoryFilter" value={filterCategory} onChange={handleCategoryChange}>
              <option value="ALL">All</option>
              <option value="EDUCATION">Education</option>
              <option value="FOOD">Food</option>
              <option value="HEALTH">Health</option>
              <option value="JOB">Job</option>
              <option value="ENTERTAINMENT">Entertainment</option>
              <option value="HOUSEHOLD">Household</option>
              <option value="TRAVEL">Travel</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>
        </div>
        </div>
        <MiniCalendar />
       

       

        <div className='body-dashboard'>
  <div className='task-list'>
    <h3 onClick={toggleDueTasks} style={{ cursor: 'pointer', color: '#264653', textAlign: 'justify', marginLeft:'22%' }}>
      {showDueTasks ? '▼' : '▶'} Due Tasks
    </h3>
    {showDueTasks && (
      getDueTasks().length > 0 ? (
        getDueTasks().map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onComplete={handleCompleteTask}
          />
        ))
      ) : (
        <p style={{
          textAlign: 'center',
          color: '#2A9D8F',
          
          fontStyle: 'italic',
          fontWeight: 'bold',
          marginLeft: '20%',
          marginRight: '20%',
          
         
        }}>
          No due tasks. Keep up the great work, you're on top of everything! <FaRegSmileBeam />
        </p>
        
      )
    )}
    

    <h3 onClick={toggleUpcomingTasks} style={{ cursor: 'pointer', color: '#264653', textAlign: 'justify', marginLeft:'22%' }}>
      {showUpcomingTasks ? '▼' : '▶'} Upcoming Tasks
    </h3>
    {showUpcomingTasks && (
      getUpcomingTasks().length > 0 ? (
        getUpcomingTasks().map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onComplete={handleCompleteTask}
          />
        ))
      ) : (
        <p style={{
          textAlign: 'center',
          color: '#2A9D8F',
          
          fontStyle: 'italic',
          fontWeight: 'bold',
          marginLeft: '21%',
          marginRight: '20%',
          
        }}>
          No upcoming tasks. You're well prepared for what's ahead, keep it up! <FaRegSmileBeam />
        </p>
      )
    )}
  </div>
</div>



        {showAddTaskForm && <AddTaskForm toggleForm={toggleAddTaskForm} editTask={editTask} />}
        {popupNotifications.map((message, index) => (
          <Notification key={index} message={message} onClose={() => handlePopupClose(index)} />
        ))}
      </main>
    </div>
  );
};

export default ViewTodoList;

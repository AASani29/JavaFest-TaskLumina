import React, { useState, useEffect, useRef } from 'react';
import '../CSS Files/Dashboard.css';
import '../CSS Files/ScheduleAnEvent.css';
import Notification from '../Pages/Notification';
import NotificationDropdown from '../Features/NotificationDropdown';
import { useNavigate } from 'react-router-dom';
import AddTaskForm from '../Features/AddTaskForm';
import Logo from "../Assets/Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClock, faFilter, faCirclePlus, faList, faCalendarDays, faAward, faTag, faGamepad, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../Auth';
import { getTasks, completeTask, getTaskProgress, updateProgress, getMyProfile, getMyRewards, markRewardAsNotified, getNotifications } from '../user-service';

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

const Dashboard = () => {
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

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
    } else {
      fetchTodayTasks();
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

  const fetchTodayTasks = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await getTasks();
      const todayTasks = data.filter(task => {
        const taskDate = new Date(task.dateTime);
        if (isNaN(taskDate.getTime())) return false;
        const taskDateFormatted = taskDate.toISOString().split('T')[0];
        return taskDateFormatted === today && !task.completed;
      });
      setTasks(todayTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
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

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="logo-container" onClick={() => navigate('/dashboard')}>
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
            <div className="sidebar-button" onClick={() => navigate('/achievements')}>
              <FontAwesomeIcon icon={faAward} className="circle-icon" />
              <span>Achievements</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button" onClick={() => navigate('/games')}>
              <FontAwesomeIcon icon={faGamepad} className="circle-icon" />
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
        <div className='time'>
          Today
        </div>
        <div className='present_time'>
          {todayDate}
        </div>
        <div className='filter'>
          <label htmlFor="filter">Filter: </label>
          <select id="filter" value={filterCriteria} onChange={handleFilterChange}>
            <option value="">Select Filter</option>
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
        <div className='task_added'>
          <div className="profile-details">
            {getFilteredTasksByCategory().map((task) => (
              <div className='eachtask' key={task.id}>
                <div className='eventname'>
                  {(task.priority === "HIGH") ? (
                    <span className='span'> <label className='hightask'> {task.name} </label>
                      <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                      <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleCompleteTask(task.id)} />
                    </span>

                  ) : ((task.priority === "MEDIUM") ?

                    (
                      <span className='span'> <label className='mediumtask'> {task.name} </label>
                        <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                        <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleCompleteTask(task.id)} />
                      </span>

                    ) : (
                      <span className='span'> <label className='lowtask'> {task.name} </label>
                        <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                        <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleCompleteTask(task.id)} />
                      </span>

                    ))
                  }
                </div>
                <div className='description'>
                  {task.description}
                </div>
                <div className='locationandtime'>
                  <span className='span'>
                    <FontAwesomeIcon icon={faTag} className='location-icon' />
                    {task.category}
                  </span>
                  <span className='span'>
                    <FontAwesomeIcon icon={faClock} className='location-icon' />
                    {new Date(task.dateTime).toLocaleString()}
                  </span>
                  <span className='span'>
                    <FontAwesomeIcon icon={faFilter} className='location-icon' />
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
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

export default Dashboard;

import React, { useState, useEffect, useRef } from 'react';
import '../CSS Files/Viewtodolist.css';
import { useNavigate } from 'react-router-dom';
import AddTaskForm from '../Features/AddTaskForm';
import Logo from "../Assets/Logo.png";
import Calendar from "../Assets/299092_calendar_icon.png";
import Notification from '../Pages/Notification';
import NotificationDropdown from '../Features/NotificationDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClock, faFilter, faTag } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus, faList, faCalendarDays, faAward, faGamepad, faEdit, faCheck, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
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
  const [showDueTasks, setShowDueTasks] = useState(true); // State to toggle due tasks
  const [showUpcomingTasks, setShowUpcomingTasks] = useState(true); // State to toggle upcoming tasks
  const notificationsFetchedRef = useRef(false);

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

  const toggleDueTasks = () => {
    setShowDueTasks(!showDueTasks);
  };

  const toggleUpcomingTasks = () => {
    setShowUpcomingTasks(!showUpcomingTasks);
  };

  const renderTasks = () => {
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'HIGH': return 'green';
        case 'MEDIUM': return 'purple';
        case 'LOW': return 'black';
        default: return 'black';
      }
    };

    const filteredTasks = getFilteredTasksByCategory();
    const today = new Date().toISOString().split('T')[0];
    const dueTasks = filteredTasks.filter(task => {
      const taskDate = new Date(task.dateTime).toISOString().split('T')[0];
      return taskDate < today && !task.completed;
    });

    const futureTasks = filteredTasks.filter(task => {
      const taskDate = new Date(task.dateTime).toISOString().split('T')[0];
      return taskDate >= today && !task.completed;
    });

    return (
      <>
        <div className='task-section'>
          <h3 onClick={toggleDueTasks}>
            <FontAwesomeIcon icon={showDueTasks ? faChevronDown : faChevronRight} /> Due Tasks
          </h3>
          {showDueTasks && dueTasks.length > 0 && dueTasks.map((task) => (
            <div className='task-card' key={task.id}>
              <div className='task-header'>
                <h3 style={{ color: getPriorityColor(task.priority) }}>{task.name}</h3>
                <span className="task-datetime">
                  {new Date(task.dateTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {' '}
                  {new Date(task.dateTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </span>
                <div className="task-icons">
                  <FontAwesomeIcon icon={faEdit} className="task-icon-edit" onClick={() => handleEditTask(task)} />
                  <FontAwesomeIcon icon={faCheck} className="task-icon-done" onClick={() => handleCompleteTask(task.id)} />
                </div>
              </div>
              <div className='task-description'>
                {task.description}
              </div>
              <div className='task-details'>
                <span className="t-details">
                  <FontAwesomeIcon icon={faTag} /> {task.category}
                </span>
                <span className="t-details">
                  <FontAwesomeIcon icon={faFilter} /> {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className='task-section'>
          <h3 onClick={toggleUpcomingTasks}>
            <FontAwesomeIcon icon={showUpcomingTasks ? faChevronDown : faChevronRight} /> Upcoming Tasks
          </h3>
          {showUpcomingTasks && futureTasks.length > 0 && futureTasks.map((task) => (
            <div className='task-card' key={task.id}>
              <div className='task-header'>
                <h3 style={{ color: getPriorityColor(task.priority) }}>{task.name}</h3>
                <span className="task-datetime">
                  {new Date(task.dateTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {' '}
                  {new Date(task.dateTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </span>
                <div className="task-icons">
                  <FontAwesomeIcon icon={faEdit} className="task-icon-edit" onClick={() => handleEditTask(task)} />
                  <FontAwesomeIcon icon={faCheck} className="task-icon-done" onClick={() => handleCompleteTask(task.id)} />
                </div>
              </div>
              <div className='task-description'>
                {task.description}
              </div>
              <div className='task-details'>
                <span className="t-details">
                  <FontAwesomeIcon icon={faTag} /> {task.category}
                </span>
                <span className="t-details">
                  <FontAwesomeIcon icon={faFilter} /> {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
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
              <FontAwesomeIcon icon={faCirclePlus} className="circle-icon" />
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
          <div className='hero-date'>
            <div className='calendar-icon'>
              <img src={Calendar} alt="Calendar Icon" />
            </div>
            <div className='date-text'>
              {todayDate}
            </div>
          </div>
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

        <div className='task-list1'>
          {tasks.length === 0 ? "No task added yet" : renderTasks()}
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

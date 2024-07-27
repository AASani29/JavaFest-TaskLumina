import React, { useState, useEffect } from 'react';
import '../CSS Files/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import AddTaskForm from '../Features/AddTaskForm';
import Logo from "../Assets/Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faClock, faFilter, faRobot, faTag } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus, faList, faCalendarDays, faAward, faGamepad, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../Auth';
import { getTasks, deleteTask } from '../user-service';
import { getMyProfile } from '../user-service';

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

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      console.log("Not logged in, userData missing");
    } else {
      fetchAllTasks();
      fetchUserProfile();
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
      console.log("Fetched all tasks:", data);
    } catch (error) {
      console.error("Failed to fetch all tasks:", error);
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

  const handleEditTask = (task) => {
    setEditTask(task);
    setShowAddTaskForm(true);
  };

  const toggleAddTaskForm = () => {
    setEditTask(null);
    setShowAddTaskForm(!showAddTaskForm);
  };

  const renderTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    const dueTasks = tasks.filter(task => {
      const taskDate = new Date(task.dateTime).toISOString().split('T')[0];
      return taskDate < today;
    });

    const futureTasks = tasks.filter(task => {
      const taskDate = new Date(task.dateTime).toISOString().split('T')[0];
      return taskDate >= today;
    });

    return (
      <>
        {dueTasks.length > 0 && (

         

          <div className='task-section'>
        <div className="profile-details">
        <h3>Due Tasks</h3>
        {dueTasks.map((task) => (
          <div className='eachtask' >
            <div className='eventname'>
              {(task.priority ==="HIGH")? (
                <span className='span'> <label className='hightask'> {task.name} </label> 
                <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
                </span>

              ) : ( (task.priority ==="MEDIUM")?
              
              (
                <span className='span'> <label className='mediumtask'> {task.name} </label> 
                <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
                </span>

              ) : (
                <span className='span'> <label className='lowtask'> {task.name} </label> 
                <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
                </span>

              ))
            }
          
              
            </div>
            <div className='description'>
               {task.description}
            </div>
            <div className='locationandtime'>
              <span className='span'>
                <FontAwesomeIcon icon={faTag} className='location-icon'/> 
                {task.category} </span>
              <span className='span'>
                <FontAwesomeIcon icon={faClock} className='location-icon'/> 
                {new Date(task.dateTime).toLocaleString()} </span>
              <span className='span'>
                <FontAwesomeIcon icon={faFilter} className='location-icon'/> 
                {task.priority} </span>
            </div>
            

          </div>
          
        ))}
        </div>

          
        </div>
        )}

       

<div className='task-section'>
        <div className="profile-details">
        <h3>Upcoming Tasks</h3>
        {futureTasks.map((task) => (
          <div className='eachtask' >
            <div className='eventname'>
              {(task.priority ==="HIGH")? (
                <span className='span'> <label className='hightask'> {task.name} </label> 
                <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
                </span>

              ) : ( (task.priority ==="MEDIUM")?
              
              (
                <span className='span'> <label className='mediumtask'> {task.name} </label> 
                <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
                </span>

              ) : (
                <span className='span'> <label className='lowtask'> {task.name} </label> 
                <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
                </span>

              ))
            }
          
              
            </div>
            <div className='description'>
               {task.description}
            </div>
            <div className='locationandtime'>
              <span className='span'>
                <FontAwesomeIcon icon={faTag} className='location-icon'/> 
                {task.category} </span>
              <span className='span'>
                <FontAwesomeIcon icon={faClock} className='location-icon'/> 
                {new Date(task.dateTime).toLocaleString()} </span>
              <span className='span'>
                <FontAwesomeIcon icon={faFilter} className='location-icon'/> 
                {task.priority} </span>
            </div>
            

          </div>
          
        ))}
        </div>

          
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
              <span>Todays Tasks</span>
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
            <div className="sidebar-button" >
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
            
           
            {/* <FontAwesomeIcon icon={faUser} className="user-icon" onClick={handleLogout} style={{ cursor: 'pointer' }} /> */}
          </div>
        </header>
        <div className='time'>
          All Tasks
        </div>
        <div className='present_time'>
        {todayDate}
        </div>
        <div className='task_added'>
          {tasks.length === 0 ? "No task added yet" : renderTasks()}
        </div>
        
        
        {showAddTaskForm && <AddTaskForm toggleForm={toggleAddTaskForm} editTask={editTask} />} {/* Conditionally render the AddTaskForm */}
      </main>
    </div>
  );
}

export default ViewTodoList;

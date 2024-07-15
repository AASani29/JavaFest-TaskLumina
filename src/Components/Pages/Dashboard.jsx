// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import '../CSS Files/Dashboard.css'; // Create a CSS file for styling
import { useNavigate } from 'react-router-dom';
import AddTaskForm from '../Features/AddTaskForm'; // Import the AddTaskForm component
import Logo from "../Assets/Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCirclePlus, faList, faCalendarDays, faAward, faGamepad, faComment, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../Auth/index';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAddTaskForm, setShowAddTaskForm] = useState(false); // State to control form visibility

  useEffect(() => {
    const user = getCurrentUser();
    
    if (!user) {
      navigate("/login");
      console.log("Not logged in, userData missing");
    }
  }, [navigate]);

  const toggleAddTaskForm = () => {
    setShowAddTaskForm(!showAddTaskForm);
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo1" />
        </div>
        <ul>
          <li>
            <div className="sidebar-button" onClick={toggleAddTaskForm}>
              <FontAwesomeIcon icon={faCirclePlus} className="circle-icon" />
              <span>Add Task</span>
            </div>
          </li>
          <li>
            <div className="sidebar-button">
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
            <div className="sidebar-button">
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
            <FontAwesomeIcon icon={faUser} className="user-icon" />
          </div>
        </header>
        <div className='time'>
          Today
        </div>
        <div className='present_time'>
          12 July-Friday
        </div>
        <div className='task_added'>
          No task added yet
        </div>
        <div className="add-task-button" onClick={toggleAddTaskForm}>
          <FontAwesomeIcon icon={faPlus} className="add-task-icon" />
          <span>Add Task</span>
        </div>
        <div className="chat-button-container">
          <FontAwesomeIcon icon={faComment} className="chat-icon flip-horizontal" />
        </div>
        {showAddTaskForm && <AddTaskForm toggleForm={toggleAddTaskForm} />} {/* Conditionally render the AddTaskForm */}
      </main>
    </div>
  );
}

export default Dashboard;

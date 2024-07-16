import React, { useState, useEffect } from 'react';
import '../CSS Files/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import AddTaskForm from '../Features/AddTaskForm';
import Logo from "../Assets/Logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faClock } from '@fortawesome/free-regular-svg-icons';
import { faCirclePlus, faList, faCalendarDays, faAward, faGamepad, faComment, faPlus, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getCurrentUser } from '../Auth';
import { getTasks, deleteTask } from '../user-service';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      console.log("Not logged in, userData missing");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
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
            <div className="sidebar-button" onClick={fetchTasks}>
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

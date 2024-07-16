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

const ViewTodoList = () => {
  const navigate = useNavigate();
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      console.log("Not logged in, userData missing");
    } else {
      fetchAllTasks();
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
          <div className="task-section">
            <h3>Due Tasks</h3>
            <ul>
              {dueTasks.map(task => (
                <li key={task.id}>
                  {task.name} - {task.description}
                  <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                  <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="task-section">
          <h3>Upcoming Tasks</h3>
          <ul>
            {futureTasks.map(task => (
              <li key={task.id}>
                {task.name} - {task.description}
                <FontAwesomeIcon icon={faEdit} className="task-icon" onClick={() => handleEditTask(task)} />
                <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteTask(task.id)} />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
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
            <FontAwesomeIcon icon={faUser} className="user-icon" />
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

export default ViewTodoList;

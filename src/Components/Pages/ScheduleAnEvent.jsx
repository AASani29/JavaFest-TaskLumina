import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faClock, faCirclePlus, faPlus, faList, faCalendarDays, faAward, faGamepad, faComment } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Logo from "../Assets/Logo.png";
import '../CSS Files/ScheduleAnEvent.css';
import { getEvents, addEvent } from '../event-service';
import AddEventForm from '../Features/AddEventForm';

const ScheduleAnEvent = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [eventData, setEventData] = useState({
    title: "",
    time: "",
    location: "",
    link: "",
    remindMe: false,
    dateTime: "",
    userId: null,
  });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setEventData((prevData) => ({ ...prevData, userId: userData.id }));
    }
  }, []);

  const onChange = (date) => {
    setDate(date);
  };

  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleScheduleEvent = async () => {
    try {
      const combinedDateTime = new Date(`${date.toDateString()} ${eventData.time}`);
      await addEvent({ ...eventData, dateTime: combinedDateTime });
      fetchEvents(); // Refresh events after adding
      setShowEventForm(false); // Close form after scheduling
    } catch (error) {
      console.error('Error scheduling event:', error);
    }
  };

  const toggleAddTaskForm = () => {
    navigate('/dashboard');
  };

  const handleDateClick = (value) => {
    setDate(value);
    setEventData({ ...eventData, dateTime: value }); // Use dateTime for consistency with backend
    setShowEventForm(true);
  };

  const handleInputChange = (e, field) => {
    setEventData({ ...eventData, [field]: e.target.value });
  };

  const handleRemindMeChange = (e) => {
    setEventData({ ...eventData, remindMe: e.target.checked });
  };

  const handleSetEvent = (e) => {
    e.preventDefault();
    handleScheduleEvent();
  };
  const handleChange = (e, field) => {
    setEventData({ ...eventData, [field]: e.target.value });
  };
  const toggleAddEventForm = () => {
    setEditEvent(null);
    setShowEventForm(!showEventForm);
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
            <FontAwesomeIcon icon={faUser} className="user-icon" />
          </div>
        </header>
        

          <div className='time'>
          Events
          </div>
          <div className="task_added">
        
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date & Time</th>
                  <th>Location</th>
                  <th>Link</th>
                  <th>Remind Me</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={index}>
                    <td>{event.title}</td>
                    <td>{new Date(event.dateTime).toLocaleString()}</td>
                    <td>{event.location}</td>
                    <td><a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a></td>
                    <td>{event.remindMe ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
        <div className='present_time'>
          {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <button className="add-task-button" onClick={() => setShowEventForm(true)}>
              Schedule Event
            </button>
        
        
          <div className="add-task-button" onClick={toggleAddEventForm}>
          <FontAwesomeIcon icon={faPlus} className="add-task-icon" />
          <span>Add Event</span>
        </div>
          
        
        <div className="chat-button-container">
          <FontAwesomeIcon icon={faComment} className="chat-icon flip-horizontal" />
        </div>
        {showEventForm && <AddEventForm toggleForm={toggleAddEventForm} editEvent={editEvent} />}
      </main>
    </div>
  );
};

export default ScheduleAnEvent;

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEdit, faCheck, faClock, faCirclePlus, faPlus, faList, faCalendarDays, faAward, faGamepad, faLocationDot, faRobot} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Logo from "../Assets/Logo.png";
import '../CSS Files/ScheduleAnEvent.css';
import { getEvents, addEvent, deleteEvent, updateEvent } from '../event-service';
import AddEventForm from '../Features/AddEventForm';
import { getMyProfile } from '../user-service';
import { getCurrentUser } from '../Auth';
const ScheduleAnEvent = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [userProfile, setUserProfile] = useState(null); 
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
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      console.log("Not logged in, userData missing");
    } else {
      fetchEvents();
      fetchUserProfile();
    }
  }, [navigate]);
  

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

  const handleUpdateEvent = async () => {
    try {
      const combinedDateTime = new Date(`${date.toDateString()} ${eventData.time}`);
      await updateEvent(editEvent.id, { ...eventData, dateTime: combinedDateTime });
      fetchEvents(); // Refresh events after updating
      setShowEventForm(false); // Close form after updating
      setEditEvent(null); // Clear editEvent state
    } catch (error) {
      console.error('Error updating event:', error);
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
    if (editEvent) {
      handleUpdateEvent();
    } else {
      handleScheduleEvent();
    }
  };

  const toggleAddEventForm = () => {
    setEditEvent(null);
    setShowEventForm(!showEventForm);
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setEventData({
      title: event.title,
      time: new Date(event.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location: event.location,
      link: event.link,
      remindMe: event.remindMe,
      dateTime: event.dateTime,
      userId: event.userId,
    });
    setDate(new Date(event.dateTime));
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
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
          Events
        </div>
        <div className='task_added'>
        <div className="profile-details">
        {events.map((event) => (
          <div >
            <div className='eventname'>
              <span className='span'> {event.title} 
              <FontAwesomeIcon icon={faEdit} className="task-icon"  onClick={() => handleEditEvent(event)} />
              <FontAwesomeIcon icon={faCheck} className="task-icon" onClick={() => handleDeleteEvent(event.id)} />
              </span>
              
            </div>
            <div className='locationandtime'>
              <span className='span'>
                <FontAwesomeIcon icon={faLocationDot} className='location-icon'/> 
                {event.location}</span>
              <span className='span'>
                <FontAwesomeIcon icon={faClock} className='location-icon'/> 
                {new Date(event.dateTime).toLocaleString()} </span>
            </div>
            <div className='links'>
              <span> <a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a></span>
            </div>

          </div>
          
        ))}
        </div>

          
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
          <FontAwesomeIcon icon={faRobot} className="chat-icon flip-horizontal" />
        </div>
        {showEventForm && <AddEventForm toggleForm={toggleAddEventForm} editEvent={editEvent} />}
      </main>
    </div>
  );
};

export default ScheduleAnEvent;
  
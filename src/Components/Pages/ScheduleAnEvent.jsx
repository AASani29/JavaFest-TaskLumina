import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faBell, faCalendarDays, faCirclePlus, faClock, faEllipsisV, faGamepad, faList } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Logo from "../Assets/Logo.png";
import '../CSS Files/ScheduleAnEvent.css';
import { getEvents, addEvent, deleteEvent, updateEvent } from '../event-service';
import AddEventForm from '../Features/AddEventForm';
import { getMyProfile, getNotifications } from '../user-service';
import { getCurrentUser } from '../Auth';
import NotificationDropdown from '../Features/NotificationDropdown';

import { SlBadge } from "react-icons/sl";
import { FiPlusCircle , FiClock, FiCalendar } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";


const ScheduleAnEvent = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [showAllEvents, setShowAllEvents] = useState(true);

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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      console.log("Not logged in, userData missing");
    } else {
      fetchEvents();
      fetchUserProfile();
      fetchNotifications();
    }
  }, [navigate]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setEventData((prevData) => ({ ...prevData, userId: userData.id }));
    }
  }, []);

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

  const fetchNotifications = async () => {
    try {
      const storedNotifications = await getNotifications(); // Fetch stored notifications from the backend
      setNotifications(storedNotifications.map(notification => notification.message));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const toggleAddTaskForm = () => {
    navigate('/dashboard');
  };

  const handleDateClick = (value) => {
    setDate(value);
    const eventsForDate = events.filter(event => new Date(event.dateTime).toDateString() === value.toDateString());
    setEventsForSelectedDate(eventsForDate);
    setShowAllEvents(false); // Hide all events and show only selected date's events
    setShowEventForm(false); // Ensure form is hidden when clicking on a date
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
    setShowEventForm(true); // Show the form when the button is clicked
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setSelectedEvent(event);
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

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  const toggleDropdown = (eventId) => {
    setShowDropdown(showDropdown === eventId ? null : eventId);
  };

  const toggleExpandEvent = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const highlightDates = events.map(event => new Date(event.dateTime).toDateString());

  const isHighlighted = ({ date, view }) => {
    if (view === 'month') {
      return highlightDates.includes(date.toDateString());
    }
    return false;
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
            <FiPlusCircle  className="circle-icon" />
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
            <FiClock  className="circle-icon" />
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
            {showNotifications && (
              <NotificationDropdown
                notifications={notifications}
                onCloseNotification={handleCloseNotification}
              />
            )}
          </div>
        </header>
        
        <div className='schedule-an-event'>
          <div className='calendar-container'>
            <Calendar 
              onClickDay={handleDateClick} 
              value={date}
              tileClassName={({ date, view }) => isHighlighted({ date, view }) ? 'highlighted' : null}
            />
          </div>
          <div className="events-list">
  <h3>Upcoming Events</h3>
  {showAllEvents
    ? events.map(event => (
        <div 
          key={event.id} 
          className={`event-item ${expandedEventId === event.id ? 'expanded' : ''}`}
          onClick={() => toggleExpandEvent(event.id)}
        >
          <span>{event.title}</span>
          <FontAwesomeIcon 
            icon={faEllipsisV} 
            className="event-options-icon" 
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from triggering the card expansion
              toggleDropdown(event.id);
            }} 
          />
          {showDropdown === event.id && (
            <div className={`dropdown-menu ${showDropdown === event.id ? 'show' : ''}`}>
              <div onClick={() => handleEditEvent(event)}>Update</div>
              <div onClick={() => handleDeleteEvent(event.id)}>Delete</div>
            </div>
          )}
          {expandedEventId === event.id && (
            <div className="event-details">
              <p><strong>Location: </strong><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer">{event.location}</a></p>
              <p><strong>Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
              <p><strong>Link:</strong> <a href={`http://${event.link}`} target="_blank" rel="noopener noreferrer">{event.link}</a></p>
            </div>
          )}
        </div>
      ))
    : (
      <>
        {eventsForSelectedDate.map(event => (
          <div 
            key={event.id} 
            className={`event-item ${expandedEventId === event.id ? 'expanded' : ''}`}
            onClick={() => toggleExpandEvent(event.id)}
          >
            <span>{event.title}</span>
            <FontAwesomeIcon 
              icon={faEllipsisV} 
              className="event-options-icon" 
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from triggering the card expansion
                toggleDropdown(event.id);
              }} 
            />
            {showDropdown === event.id && (
              <div className={`dropdown-menu ${showDropdown === event.id ? 'show' : ''}`}>
                <div onClick={() => handleEditEvent(event)}>Update</div>
                <div onClick={() => handleDeleteEvent(event.id)}>Delete</div>
              </div>
            )}
            {expandedEventId === event.id && (
              <div className="event-details">
                <p><strong>Location: </strong><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`} target="_blank" rel="noopener noreferrer">{event.location}</a></p>
                <p><strong>Time:</strong> {new Date(event.dateTime).toLocaleString()}</p>
                <p><strong>Link:</strong> <a href={`http://${event.link}`} target="_blank" rel="noopener noreferrer">{event.link}</a></p>
              </div>
            )}
          </div>
        ))}
        <button 
          className="add-event-button" 
          onClick={toggleAddEventForm}
          style={{ marginTop: '20px', padding: '10px 20px', fontSize: '1em', cursor: 'pointer', backgroundColor: '#1C4D53', color: '#fff', borderRadius: '10px', border: 'none' }}
        >
          Add Event
        </button>
      </>
    )
  }
</div>

        </div>

        {showEventForm && (
          <AddEventForm 
            toggleForm={toggleAddEventForm} 
            editEvent={editEvent} 
          />
        )}
      </main>
    </div>
  );
};

export default ScheduleAnEvent;

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faClock, faCirclePlus, faList, faCalendarDays, faAward, faGamepad, faComment } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Logo from "../Assets/Logo.png";
import '../CSS Files/ScheduleAnEvent.css';
import AddEventForm from '../Features/AddEventForm';
import { getEvents, addEvent } from '../event-service';

const ScheduleAnEvent = () => {
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
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
        <div className='present_time'>
          {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className='main'>
          <div className="schedule-an-event">
            <div className="event-calendar">
              <Calendar
                onChange={onChange}
                onClickDay={handleDateClick}
                value={date}
              />
              <button className="schedule-button" onClick={() => setShowEventForm(true)}>
                Schedule Event
              </button>
            </div>
            {showEventForm && (
              <div className="event-form">
                <h2>Add Event Details</h2>
                <form onSubmit={handleSetEvent}>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={eventData.title}
                      onChange={(e) => handleInputChange(e, "title")}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time</label>
                    <input
                      type="time"
                      id="time"
                      value={eventData.time}
                      onChange={(e) => handleInputChange(e, "time")}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      value={eventData.location}
                      onChange={(e) => handleInputChange(e, "location")}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="link">Link</label>
                    <input
                      type="text"
                      id="link"
                      value={eventData.link}
                      onChange={(e) => handleInputChange(e, "link")}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={eventData.remindMe}
                        onChange={handleRemindMeChange}
                      />
                      &nbsp; Remind Me
                    </label>
                  </div>
                  <button type="submit" className="set-button">Set Event</button>
                </form>
              </div>
            )}
          </div>
          <div className="event-list">
            <h2>Events</h2>
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
        </div>
        <div className="chat-button-container">
          <FontAwesomeIcon icon={faComment} className="chat-icon flip-horizontal" />
        </div>
      </main>

      {/* Modal for Add Event Form */}
      {showAddEventForm && <AddEventForm toggleForm={() => setShowAddEventForm(false)} />}
    </div>
  );
};

export default ScheduleAnEvent;

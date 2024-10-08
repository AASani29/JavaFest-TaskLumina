import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../CSS Files/ScheduleAnEvent.css";
import {
  getEvents,
  addEvent,
  deleteEvent,
  updateEvent,
} from "../Common/event-service";
import AddEventForm from "../Forms/AddEventForm";
import { getMyProfile, getNotifications } from "../Common/user-service";
import { getCurrentUser } from "../Common/Auth";
import Sidebar from "../Common/Sidebar";
import Topbar from "../Common/Topbar";

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
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setEventData((prevData) => ({ ...prevData, userId: userData.id }));
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleScheduleEvent = async () => {
    try {
      const combinedDateTime = new Date(
        `${date.toDateString()} ${eventData.time}`
      );
      await addEvent({ ...eventData, dateTime: combinedDateTime });
      fetchEvents(); // Refresh events after adding
      setShowEventForm(false); // Close form after scheduling
    } catch (error) {
      console.error("Error scheduling event:", error);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const combinedDateTime = new Date(
        `${date.toDateString()} ${eventData.time}`
      );
      await updateEvent(editEvent.id, {
        ...eventData,
        dateTime: combinedDateTime,
      });
      fetchEvents(); // Refresh events after updating
      setShowEventForm(false); // Close form after updating
      setEditEvent(null); // Clear editEvent state
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getMyProfile(); // Fetch user profile using userService function
      if (response.statusCode === 200) {
        setUserProfile(response.ourUsers); // Set user profile in state
      } else {
        console.error("Failed to fetch user profile:", response.message);
      }
    } catch (error) {
      console.error(
        "Error occurred while fetching user profile:",
        error.message
      );
    }
  };

  const fetchNotifications = async () => {
    try {
      const storedNotifications = await getNotifications(); // Fetch stored notifications from the backend
      setNotifications(
        storedNotifications.map((notification) => notification.message)
      );
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const toggleAddTaskForm = () => {
    navigate("/dashboard");
  };

  const handleDateClick = (value) => {
    setDate(value);
    const eventsForDate = events.filter(
      (event) =>
        new Date(event.dateTime).toDateString() === value.toDateString()
    );
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
    setShowEventForm(!showEventForm); // Toggle form visibility
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setSelectedEvent(event);
    setEventData({
      title: event.title,
      time: new Date(event.dateTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
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
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const toggleDropdown = (eventId) => {
    setShowDropdown(showDropdown === eventId ? null : eventId);
  };

  const toggleExpandEvent = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const highlightDates = events.map((event) =>
    new Date(event.dateTime).toDateString()
  );

  const isHighlighted = ({ date, view }) => {
    if (view === "month") {
      return highlightDates.includes(date.toDateString());
    }
    return false;
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <Topbar />

        <div className="schedule-an-event">
          <div className="calendar-container">
            <Calendar
              onClickDay={handleDateClick}
              value={date}
              tileClassName={({ date, view }) =>
                isHighlighted({ date, view }) ? "highlighted" : null
              }
            />
          </div>
          <div className="events-list">
            <h3>Upcoming Events</h3>
            {showAllEvents ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className={`event-item ${
                    expandedEventId === event.id ? "expanded" : ""
                  }`}
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
                    <div
                      className={`dropdown-menu ${
                        showDropdown === event.id ? "show" : ""
                      }`}
                    >
                      <div onClick={() => handleEditEvent(event)}>Update</div>
                      <div onClick={() => handleDeleteEvent(event.id)}>
                        Delete
                      </div>
                    </div>
                  )}
                  {expandedEventId === event.id && (
                    <div className="event-details">
                      <p>
                        <strong>Location: </strong>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            event.location
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {event.location}
                        </a>
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {new Date(event.dateTime).toLocaleString()}
                      </p>
                      <p>
                        <strong>Link:</strong>{" "}
                        <a
                          href={`http://${event.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {event.link}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                {eventsForSelectedDate.map((event) => (
                  <div
                    key={event.id}
                    className={`event-item ${
                      expandedEventId === event.id ? "expanded" : ""
                    }`}
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
                      <div
                        className={`dropdown-menu ${
                          showDropdown === event.id ? "show" : ""
                        }`}
                      >
                        <div onClick={() => handleEditEvent(event)}>Update</div>
                        <div onClick={() => handleDeleteEvent(event.id)}>
                          Delete
                        </div>
                      </div>
                    )}
                    {expandedEventId === event.id && (
                      <div className="event-details">
                        <p>
                          <strong>Location: </strong>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              event.location
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {event.location}
                          </a>
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {new Date(event.dateTime).toLocaleString()}
                        </p>
                        <p>
                          <strong>Link:</strong>{" "}
                          <a
                            href={`http://${event.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {event.link}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  className="add-event-button"
                  onClick={toggleAddEventForm}
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "1em",
                    cursor: "pointer",
                    backgroundColor: "#1C4D53",
                    color: "#fff",
                    borderRadius: "10px",
                    border: "none",
                  }}
                >
                  Add Event
                </button>
              </>
            )}
          </div>
        </div>

        {showEventForm && (
          <AddEventForm toggleForm={toggleAddEventForm} editEvent={editEvent} />
        )}
      </main>
    </div>
  );
};

export default ScheduleAnEvent;

import React, { useState } from 'react';
import '../CSS Files/AddEventForm.css'; // Import CSS file
import { addEvent } from '../event-service'; // Import event service methods

const AddEventForm = ({ toggleForm }) => {
  const [eventData, setEventData] = useState({
    title: '',
    time: '',
    location: '',
    link: '',
    remindMe: false,
  });

  const handleInputChange = (e, field) => {
    setEventData({ ...eventData, [field]: e.target.value });
  };

  const handleRemindMeChange = (e) => {
    setEventData({ ...eventData, remindMe: e.target.checked });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      await addEvent(eventData);
      toggleForm(); // Close the form after adding event
    } catch (error) {
      console.error('Failed to add event:', error);
      // Handle error state or display error message to user
    }
  };

  return (
    <div className="add-event-form">
      <h2>Add Event</h2>
      <form onSubmit={handleAddEvent}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={eventData.title}
            onChange={(e) => handleInputChange(e, 'title')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            value={eventData.time}
            onChange={(e) => handleInputChange(e, 'time')}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={eventData.location}
            onChange={(e) => handleInputChange(e, 'location')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input
            type="text"
            id="link"
            value={eventData.link}
            onChange={(e) => handleInputChange(e, 'link')}
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
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEventForm;

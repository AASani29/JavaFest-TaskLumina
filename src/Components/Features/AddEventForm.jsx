import React, { useState, useEffect } from 'react';
import '../CSS Files/AddEventForm.css'; // Import CSS file
import { addEvent, updateEvent } from '../event-service'; // Import event service methods
import { toast } from 'react-toastify';

const AddEventForm = ({ toggleForm, editEvent }) => {
  const [eventData, setEventData] = useState({
    title: '',
    dateTime: '', // Corrected to match your field names
    location: '',
    link: '',
    remindMe: false,
  });
  useEffect(() => {
    if (editEvent) {
      setEventData(editEvent);
    }
  }, [editEvent]);

  const handleChange = (e, field) => {
    setEventData({ ...eventData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editEvent) {
      updateEvent(eventData.id, eventData)
        .then((res) => {
          toast.success("Event updated successfully!");
          toggleForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to update Event!");
        });
    } else {
      addEvent(eventData)
        .then((res) => {
          toast.success("Event added successfully!");
          toggleForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to add Event!");
        });
    }
  };

  const handleInputChange = (e, field) => {
    setEventData({ ...eventData, [field]: e.target.value });
  };

  const handleRemindMeChange = (e) => {
    setEventData({ ...eventData, remindMe: e.target.checked });
  };

  // const handleAddEvent = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await addEvent(eventData);
  //     toast.success('Event added successfully!');
  //     toggleForm(); // Close the form after adding event
  //   } catch (error) {
  //     console.error('Failed to add event:', error);
  //     toast.error('Failed to add event!');
  //     // Handle error state or display error message to user
  //   }
  // };

  return (
    <div className="add-event-form">
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit}>
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
          <label htmlFor="dateTime">Date and Time</label>
          <input
            type="datetime-local"
            id="dateTime"
            name="dateTime"
            value={eventData.dateTime}
            onChange={(e) => handleInputChange(e, 'dateTime')}
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
        <button type="submit">{editEvent ? "Update Event" : "Add Event"}</button>
          <button type="button" onClick={toggleForm}>Cancel</button>
      </form>
    </div>
  );
};

export default AddEventForm;

import React, { useState, useEffect } from "react";
import "../CSS Files/AddEventForm.css";
import { addEvent, updateEvent } from "../Common/event-service";
import { toast } from "react-toastify";

const AddEventForm = ({ toggleForm, editEvent }) => {
  const [eventData, setEventData] = useState({
    title: "",
    dateTime: "",
    location: "",
    link: "",
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
    console.log("Form submitted"); // Debug log
    if (editEvent) {
      updateEvent(eventData.id, eventData)
        .then(() => {
          toast.success("Event updated successfully!");
          toggleForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to update Event!");
        });
    } else {
      addEvent(eventData)
        .then(() => {
          toast.success("Event added successfully!");
          toggleForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to add Event!");
        });
    }
  };

  const handleRemindMeChange = (e) => {
    console.log("Remind Me clicked"); // Debug log
    setEventData({ ...eventData, remindMe: e.target.checked });
  };

  return (
    <div className="add-event-form-container">
      <form onSubmit={handleSubmit} className="add-event-form">
        <div className="form-group">
          <input
            type="text"
            id="title"
            placeholder="Event title"
            value={eventData.title}
            onChange={(e) => handleChange(e, "title")}
            required
          />
        </div>
        <div className="form-group form-group-inline">
          <div className="custom-card">
            <label htmlFor="dateTime" className="custom-label">
              <i className="fa fa-calendar"></i>
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              value={eventData.dateTime}
              onChange={(e) => handleChange(e, "dateTime")}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <input
            type="text"
            id="location"
            placeholder="Location"
            value={eventData.location}
            onChange={(e) => handleChange(e, "location")}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            id="link"
            placeholder="Link"
            value={eventData.link}
            onChange={(e) => handleChange(e, "link")}
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
        <div className="form-buttons">
          <button type="submit">
            {editEvent ? "Update Event" : "Add Event"}
          </button>
          <button type="button" onClick={toggleForm}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm;

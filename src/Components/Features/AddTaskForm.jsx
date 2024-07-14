// src/components/AddTaskForm.js
import React, { useState } from 'react';
import '../CSS Files/AddTaskForm.css'; // Create a CSS file for styling the form
import { addTask } from '../user-service.js'; // Import the addTask function from user-service
import { toast } from "react-toastify";

const AddTaskForm = ({ toggleForm }) => {
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    dateTime: "",
    priority: "LOW",
    category: ""
  });

  const handleChange = (e, field) => {
    setTaskData({ ...taskData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(taskData)
      .then((res) => {
        toast.success("Task added successfully!");
        toggleForm(); // Close the form after successful submission
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add task!");
      });
  };

  return (
    <div className="add-task-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={taskData.name}
            onChange={(e) => handleChange(e, "name")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={taskData.description}
            onChange={(e) => handleChange(e, "description")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateTime">Date and Time</label>
          <input
            type="datetime-local"
            id="dateTime"
            name="dateTime"
            value={taskData.dateTime}
            onChange={(e) => handleChange(e, "dateTime")}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={taskData.priority}
            onChange={(e) => handleChange(e, "priority")}
            required
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={taskData.category}
            onChange={(e) => handleChange(e, "category")}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit">Add Task</button>
          <button type="button" onClick={toggleForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;

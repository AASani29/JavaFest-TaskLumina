import React, { useState, useEffect } from 'react';
import '../CSS Files/AddTaskForm.css';
import { addTask, updateTask } from '../user-service.js'; // Import updateTask function from user-service
import { toast } from "react-toastify";

const AddTaskForm = ({ toggleForm, editTask }) => {
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    dateTime: "",
    priority: "LOW",
    category: "OTHERS"
  });

  useEffect(() => {
    if (editTask) {
      setTaskData(editTask);
    }
  }, [editTask]);

  const handleChange = (e, field) => {
    setTaskData({ ...taskData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editTask) {
      updateTask(taskData.id, taskData)
        .then((res) => {
          toast.success("Task updated successfully!");
          toggleForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to update task!");
        });
    } else {
      addTask(taskData)
        .then((res) => {
          toast.success("Task added successfully!");
          toggleForm();
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to add task!");
        });
    }
  };

  // Function to get today's date in the format YYYY-MM-DDTHH:MM
  const getTodayDateTime = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
            min={getTodayDateTime()} // Set the min attribute to today's date
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
          <select
            id="category"
            name="category"
            value={taskData.category}
            onChange={(e) => handleChange(e, "category")}
            required
          >
            <option value="EDUCATION">Education</option>
            <option value="FOOD">Food</option>
            <option value="HEALTH">Health</option>
            <option value="JOB">Job</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="HOUSEHOLD">Household</option>
            <option value="OTHERS">Others</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit">{editTask ? "Update Task" : "Add Task"}</button>
          <button type="button" onClick={toggleForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;

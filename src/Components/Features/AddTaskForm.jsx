import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../CSS Files/AddTaskForm.css';
import { addTask, updateTask } from '../user-service.js';
import { toast } from "react-toastify";
import { FaAlignCenter } from 'react-icons/fa';

const AddTaskForm = ({ toggleForm, editTask }) => {
  const { register, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      name: "",
      description: "",
      dateTime: "", 
      priority: "LOW", 
      category: "OTHERS" 
    }
  });

  useEffect(() => {
    if (editTask) {
      for (const key in editTask) {
        setValue(key, editTask[key]);
      }
    }
  }, [editTask, setValue]);

  const onSubmit = async (data) => {
    try {
      if (editTask) {
        const response = await updateTask(editTask.id, data);
        console.log('Task updated:', response);
        toast.success("Task updated successfully!");
      } else {
        const response = await addTask(data);
        console.log('Task added:', response);
        toast.success("Task added successfully!");
      }
      toggleForm();
    } catch (err) {
      console.error('Error:', err);
      toast.error(editTask ? "Failed to update task!" : "Failed to add task!");
    }
  };

  return (
    <div className="add-task-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="add-task-form">
        <div className="form-group">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Task name"
            {...register("name", { required: true })}
            defaultValue={getValues("name")}
          />
        </div>
        <div className="form-group form-group-description">
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            {...register("description", { required: false })}
            defaultValue={getValues("description")}
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
              name="dateTime"
              placeholder="Set Time"
              {...register("dateTime", { required: false })}
              min={new Date().toISOString().slice(0, 16)}
              defaultValue={getValues("dateTime")}
            />
          </div>

          <div className="custom-card">
            <select
              id="priority"
              name="priority"
              {...register("priority", { required: false })}
              defaultValue={getValues("priority")}
            >
              
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="custom-card">
            
            <select
              id="category"
              name="category"
              {...register("category", { required: false })}
              defaultValue={getValues("category")}
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

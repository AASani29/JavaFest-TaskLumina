import React, { useState, useRef, useEffect } from "react";
import { FiCalendar, FiClock } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { SlBadge } from "react-icons/sl";
import { MdOutlineToday } from "react-icons/md";
import Logo from "../Assets/Logo.png";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "../Common/NotificationDropdown";
import ReactToPrint from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  generateRoutine,
  getMyProfile,
  getNotifications,
  markNotificationAsRead,
} from "../Common/user-service";
import "../CSS Files/RoutineForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faPrint,
  faDownload,
  faClock,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Common/Sidebar";
import Topbar from "../Common/Topbar";

const RoutineForm = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState("");
  const [priority, setPriority] = useState("");
  const [fixedStartTime, setFixedStartTime] = useState("");
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("22:00");
  const [routine, setRoutine] = useState([]);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const routineRef = useRef();
  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    const fetchProfileAndNotifications = async () => {
      try {
        const profile = await getMyProfile();
        setUserProfile(profile);

        const userNotifications = await getNotifications();
        setNotifications(userNotifications);
      } catch (error) {
        console.error("Error fetching profile or notifications:", error);
      }
    };

    fetchProfileAndNotifications();
  }, []);

  const addTask = () => {
    if (taskName && duration) {
      setTasks([
        ...tasks,
        {
          name: taskName,
          duration: parseInt(duration),
          priority: parseInt(priority) || 0,
          fixedStartTime: fixedStartTime || null,
        },
      ]);
      setTaskName("");
      setDuration("");
      setPriority("");
      setFixedStartTime("");
    }
  };

  const handleGenerateRoutine = async () => {
    try {
      const timeRange = `${startTime}-${endTime}`;
      const generatedRoutine = await generateRoutine({ tasks, timeRange });
      setRoutine(generatedRoutine.scheduledTasks || []);
      setError("");
      if (generatedRoutine.failedTasks.length > 0) {
        let errorMsg = "Some tasks could not be scheduled:\n";
        generatedRoutine.failedTasks.forEach((task) => {
          errorMsg += `${task.taskName}: ${task.reason}\n`;
        });
        setError(errorMsg);
      }
    } catch (error) {
      console.error("Failed to generate routine", error);
      setError(
        "An error occurred while generating the routine. Please try again."
      );
    }
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };
  const handleCloseNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  const handleDownloadPDF = () => {
    const input = routineRef.current;

    // Use html2canvas to capture the content of the routine
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF with A4 dimensions

        // Calculate the scale factor to fit the content to the PDF width
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the image to the PDF with the correct scaling
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("routine.pdf");
      })
      .catch((err) => {
        console.error("Failed to download PDF", err);
      });
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="content">
        <Topbar />

        <div className="routine-form-container">
          <div className="routine-form">
            <h2>Create Your Routine</h2>
            <div>
              <label>Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label>End Time:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <input
                type="number"
                placeholder="Priority (1-5)"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
              <input
                type="time"
                placeholder="Fixed Start Time (optional)"
                value={fixedStartTime}
                onChange={(e) => setFixedStartTime(e.target.value)}
              />
              <button onClick={addTask}>Add Task</button>
            </div>

            <h3>Tasks</h3>
            <ul>
              {tasks.map((task, index) => (
                <li key={index}>
                  {task.name} - {task.duration} mins - Priority: {task.priority}
                  {task.fixedStartTime &&
                    ` - Fixed Start: ${task.fixedStartTime}`}
                </li>
              ))}
            </ul>

            <button onClick={handleGenerateRoutine}>Generate Routine</button>

            {error && <p className="error-message">{error}</p>}

            {routine.length > 0 && (
              <div className="your-routine" ref={routineRef}>
                <div className="routine-header">
                  <img src={Logo} alt="Logo" className="routine-logo" />
                  <h3>
                    Routine from {startTime} to {endTime}
                  </h3>
                  <p>Date: {currentDate}</p>
                </div>
                <ul className="routine-list">
                  {routine.map((task, index) => (
                    <li key={index}>
                      <span className="routine-task-name">{task.taskName}</span>
                      <span className="routine-task-time">
                        {task.startTime} - {task.endTime}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {routine.length > 0 && (
              <div className="routine-actions">
                <ReactToPrint
                  trigger={() => (
                    <button className="print-button">
                      <FontAwesomeIcon icon={faPrint} /> Print Routine
                    </button>
                  )}
                  content={() => routineRef.current}
                />
                <button className="download-button" onClick={handleDownloadPDF}>
                  <FontAwesomeIcon icon={faDownload} /> Download as PDF
                </button>
              </div>
            )}
          </div>

          <div className="user-manual">
            <h3>User Manual</h3>
            <p>To create your routine, follow these steps:</p>
            <ol>
              <li>
                Enter the task name, duration, and optional priority and start
                time.
              </li>
              <li>Add tasks to the list using the "Add Task" button.</li>
              <li>Set the start and end time for your routine.</li>
              <li>
                Click "Generate Routine" to create your personalized schedule.
              </li>
              <li>
                Use the buttons provided to print or download your routine.
              </li>
            </ol>
            <p>
              <strong>Note:</strong> The routine will prioritize tasks with
              fixed start times and higher priority. Breaks will be included
              automatically.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoutineForm;

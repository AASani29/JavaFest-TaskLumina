import React, { useState } from "react";
import nlp from "compromise";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import '../CSS Files/VoiceTaskManager.css'; // Import CSS file for styling

const VoiceTaskManager = () => {
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [taskSuccess, setTaskSuccess] = useState(false);


  // Initialize the SpeechRecognition API
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Function to handle speech recognition start
  recognition.onstart = () => {
    console.log("Voice recognition started. Please speak into the microphone.");
  };

  // Function to handle speech recognition result
  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    setTranscript(spokenText);
    console.log("Speech recognized:", spokenText);
    processVoiceCommand(spokenText);
  };

  // Function to start voice recognition
  const startRecognition = () => {
    recognition.start();
    setIsProcessing(true);
  };

  const processVoiceCommand = (command) => {
    console.log("Processing command:", command);

    const doc = nlp(command);
    const ignoreWords = ["i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "her", "its", "our", "their"];
    
    const title = doc
        .match("#Noun+ #Preposition* #Noun*")
        .out("text")
        .split(/\s+/)
        .filter(word => !ignoreWords.includes(word.toLowerCase()))
        .join(" ") || "New Task";

    const description = doc.match("description: #Noun+").out("text") || "";

    const currentDate = new Date();
    let dueDate = new Date(currentDate);

    // Updated regex to capture AM/PM
    const timeRegex = /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i;
    const timeMatch = command.match(timeRegex);

    let timeHours = 0;
    let timeMinutes = 0;
    let amPm = '';

    if (timeMatch) {
        timeHours = parseInt(timeMatch[1], 10);
        timeMinutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        amPm = timeMatch[3] ? timeMatch[3].toUpperCase() : '';

        // Handle 12-hour to 24-hour conversion
        if (amPm === 'PM' && timeHours < 12) {
            timeHours += 12;
        } else if (amPm === 'AM' && timeHours === 12) {
            timeHours = 0; // Midnight case
        }
        
        // Ensure hours are within valid range
        if (timeHours < 0 || timeHours > 23) timeHours = 0;
        if (timeMinutes < 0 || timeMinutes > 59) timeMinutes = 0;
    } else {
        timeHours = 12; // Default to noon if no time is specified
        timeMinutes = 0;
    }

    dueDate.setHours(timeHours);
    dueDate.setMinutes(timeMinutes);
    dueDate.setSeconds(0);

    // Convert to ISO 8601 format but with local timezone
    const offset = dueDate.getTimezoneOffset() * 60000;
    const localDateTime = new Date(dueDate.getTime() - offset);
    const formattedDateTime = localDateTime.toISOString().slice(0, 19);

    console.log("Task DateTime:", formattedDateTime);

    const taskDetails = {
        name: title,
        description: description,
        dateTime: formattedDateTime,
        priority: "LOW",
        category: "OTHERS"
    };

    createTask(taskDetails);
};



  // Function to send the task details to the backend
  const createTask = async (taskDetails) => {
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch("http://localhost:8080/adminuser/task/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(taskDetails),
      });
  
      if (response.ok) {
        console.log("Task created successfully!");
        toast.success("Task created successfully!");
        setTaskSuccess(true); // Set success message
      } else {
        console.error("Failed to create task. Server responded with:", response.statusText);
        toast.error("Failed to create task.");
      }
    } catch (error) {
      console.error("Error in API call:", error);
      toast.error("An error occurred while creating the task.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setTaskSuccess(false), 3000); // Hide success message after 3 seconds
    }
  };
  

  return (
    <div className="voice-assistant-container">
      <h2 className="title">Voice-Activated Task Manager</h2>
      <div className="instructions">
        <p className="fade-in">Now you can add tasks with your voice assistant.</p>
        <p className="fade-in"><strong>Format:</strong> "Schedule me a meeting at 5 (24H format)"</p>
        <p className="fade-in"><strong>Note:</strong> This is only for scheduling today's tasks.</p>
      </div>
      <div className="mic-container">
        <FontAwesomeIcon 
          icon={faMicrophone} 
          className={`mic-icon ${isProcessing ? 'processing' : ''}`} 
          onClick={startRecognition} 
        />
      </div>
      <p className="recognized-text">Recognized Text: {transcript}</p>
      {isProcessing && <p className="processing-feedback">Processing your command, please wait...</p>}
      {taskSuccess && <p className="success-message">Task added successfully!</p>}
    </div>
  );
};

export default VoiceTaskManager;

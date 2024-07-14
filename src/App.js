// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Login from './Components/Pages/Login.jsx';
import Register from './Components/Pages/Register.jsx'
import Dashboard from './Components/Pages//Dashboard.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;

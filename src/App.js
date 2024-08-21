// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Login from './Components/Pages/Login.jsx';
import Register from './Components/Pages/Register.jsx'
import Dashboard from './Components/Pages//Dashboard.jsx';
import ViewTodoList from './Components/Pages/ViewTodoList .jsx';
import ScheduleAnEvent from './Components/Pages/ScheduleAnEvent.jsx';
import ProfilePage from './Components/Pages/ProfilePage.jsx';
import Achievement from './Components/Pages/Achievements.jsx';
import Games from './Components/Games/Games.jsx';
import TicTacToe from './Components/Games/tic-tac-toe.jsx';
import Sudoku from './Components/Games/SudokuGame.jsx';
import RoutineForm from './Components/Features/RoutineForm.jsx';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/viewtodolist" element={<ViewTodoList />} />
        <Route path="/scheduleanevent" element={<ScheduleAnEvent />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/achievements" element={<Achievement />} />
        <Route path="/Tic-Tac-Toe" element={<TicTacToe />} />
        <Route path="/games" element={<Games />} />
        <Route path="/Sudoku" element={<Sudoku/>} />
        <Route path="/routine" element={<RoutineForm/>} />
        
      </Routes>
    </Router>
  );
}

export default App;

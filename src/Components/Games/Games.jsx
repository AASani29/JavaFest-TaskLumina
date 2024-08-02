import React from 'react';
import '../CSS Files/tic-tac-toe.css';
import  'react-router-dom';
import Logo from "../Assets/Logo.png";
import { useNavigate, useLocation } from 'react-router-dom'

const Games = () => {
    const navigate = useNavigate();
  return (
    <main>
        <nav className='sidebar'>
        <div className="logo-container" onClick={() => navigate('/dashboard')} >
          <img src={Logo} alt="Logo" className="logo1" />
        </div>
        <h1>Click to play</h1>
        <div className='games' onClick={() => navigate('/tictactoe')}>
        <span className="game-icon">Tic-Tac-Toe</span>
        </div>
        <div className='games'>
        <span className="sudoku-icon">Sudoku</span>
        </div>
        </nav>
      
    </main>
  )
}

export default Games





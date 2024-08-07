import React, { useEffect } from 'react';
import '../CSS Files/Sudoku.css';
import '../Games/Sudoku1.js';
import '../Games/sudoku2.js';
import '../Games/constant.js';

import initSudokuGame from '../Games/Sudoku1.js'; // Import the function

const SudokuGame = () => {
    useEffect(() => {
        // Run the game initialization function
        initSudokuGame();
    }, []);

    return (
        <div className="potta-one-regular">
            <nav>
                <div className="nav1-container1">
                    <a href="#" className="nav1-logo">Sudoku</a>
                    <div className="dark-mode-toggle" id="dark-mode-toggle">
                        <i className="bx bxs-sun"></i>
                        <i className="bx bxs-moon"></i>
                    </div>
                </div>
            </nav>

            <div className="main1">
                <div className="screen">
                    <div className="start-screen active" id="start-screen">
                        <input
                            type="text"
                            placeholder="Your name"
                            maxLength="11"
                            className="input-name"
                            id="input-name"
                        />
                        <div className="btn" id="btn-level">
                            Easy
                        </div>
                        <div className="btn" id="btn-continue">Continue</div>
                        <div className="btn btn-blue" id="btn-play">New game</div>
                    </div>

                    <div className="main-game" id="game-screen">
                        <div className="main-sudoku-grid">
                            {Array.from({ length: 81 }).map((_, index) => (
                                <div key={index} className="main-grid-cell"></div>
                            ))}
                        </div>

                        <div className="main-game-info">
                            <div className="main-game-info-box main-game-info-name">
                                <span id="player-name">rifah</span>
                            </div>
                            <div className="main-game-info-box main-game-info-level">
                                <span id="game-level">Easy</span>
                            </div>
                        </div>

                        <div className="main-game-info-box main-game-info-time">
                            <span id="game-time">10:20</span>
                            <div className="pause-btn" id="btn-pause">
                                <i className="bx bx-pause"></i>
                            </div>
                        </div>

                        <div className="numbers">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div key={index} className="number">{index + 1}</div>
                            ))}
                            <div className="delete" id="btn-delete">X</div>
                        </div>
                    </div>

                    <div className="pause-screen" id="pause-screen">
                    

                        <div className="btn btn-blue" id="btn-resume">
                            Resume
                        </div>
                        <div className="btn" id="btn-new-game">New game</div>
                    </div>

                    <div className="result-screen" id="result-screen">
                        <div className="congrate">Completed</div>
                        <div className="info">Time</div>
                        <div id="result-time"></div>
                        <div className="btn" id="btn-new-game-2">New game</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SudokuGame;

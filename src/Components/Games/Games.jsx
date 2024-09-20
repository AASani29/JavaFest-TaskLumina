import React, { useState } from "react";
import "../CSS Files/Games.css";
import { useNavigate } from "react-router-dom";

import { getAchievements } from "../Common/user-service";
import { getCurrentUser } from "../Common/Auth";
import TicTacToeIcon from "../Assets/tic-tac-toe-icon.png.png";
import SudokuIcon from "../Assets/Sudoku.png";
import WordPuzzleIcon from "../Assets/wordsearch.png";
import StonePaperScissorIcon from "../Assets/rock-paper-scissors.png";
import Sidebar from "../Common/Sidebar";
import Topbar from "../Common/Topbar";

const Games = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  React.useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      fetchAchievements(user.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchAchievements = async (userId) => {
    try {
      const data = await getAchievements(userId);
      setAchievements(data || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
    }
  };

  const isBadgeEarned = (badge) => {
    return achievements.some((achievement) => achievement.badge === badge);
  };

  const handleGameClick = (game) => {
    if (game === "Tic-Tac-Toe" && !isBadgeEarned("Rookie Starter")) {
      setPopupMessage("You need the Rookie Starter badge to play Tic-Tac-Toe.");
      setShowPopup(true);
    } else if (game === "Sudoku" && !isBadgeEarned("Daily Achiever")) {
      setPopupMessage("You need the Daily Achiever badge to play Sudoku.");
      setShowPopup(true);
    } else {
      navigate(`/${game.toLowerCase()}`);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <Sidebar />
      <Topbar />

      <section className="games-container">
        <div
          className="game-card"
          onClick={() => handleGameClick("Stone-Paper-Scissor")}
        >
          <img src={StonePaperScissorIcon} alt="Stone Paper Scissor" />
          <h2>Stone-Paper-Scissor</h2>
        </div>
        <div
          className={`game-card ${
            isBadgeEarned("Daily Achiever") ? "active" : "disabled"
          }`}
          onClick={() => handleGameClick("Tic-Tac-Toe")}
        >
          <img src={TicTacToeIcon} alt="Tic Tac Toe" />
          <h2>Tic-Tac-Toe</h2>
        </div>

        <div
          className="game-card"
          onClick={() => handleGameClick("WordPuzzle")}
        >
          <img src={WordPuzzleIcon} alt="Word Puzzle" />
          <h2>WordPuzzle</h2>
        </div>

        <div
          className={`game-card ${
            isBadgeEarned("Weekly Warrior") ? "active" : "disabled"
          }`}
          onClick={() => handleGameClick("Sudoku")}
        >
          <img src={SudokuIcon} alt="Sudoku" />
          <h2>Sudoku</h2>
        </div>
      </section>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Game Locked</h2>
            <p>{popupMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;

import React, {useState} from 'react';
import '../CSS Files/tic-tac-toe.css';
import { useNavigate } from 'react-router-dom';
import Logo from "../Assets/Logo.png";
import { getAchievements} from '../user-service';
import { getCurrentUser } from '../Auth'
const Games = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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
    if (game === 'Tic-Tac-Toe' && !isBadgeEarned('Rookie Starter')) {
      setPopupMessage('You need the Rookie Starter badge to play Tic-Tac-Toe.');
      setShowPopup(true);
    } else if (game === 'Sudoku' && !isBadgeEarned('Daily Achiever')) {
      setPopupMessage('You need the Daily Achiever badge to play Sudoku.');
      setShowPopup(true);
    } else {
      navigate(`/${game.toLowerCase()}`);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <main>
      <nav className='sidebar'>
        <div className="logo-container" onClick={() => navigate('/dashboard')}>
          <img src={Logo} alt="Logo" className="logo1" />
        </div>
        <h1>Click to play</h1>
        <div
          className={`games ${isBadgeEarned('Rookie Starter') ? 'active' : 'disabled'}`}
          onClick={() => handleGameClick('Tic-Tac-Toe')}
        >
          <span className="game-icon">Tic-Tac-Toe</span>
        </div>
        <div
          className={`games ${isBadgeEarned('Daily Achiever') ? 'active' : 'disabled'}`}
          onClick={() => handleGameClick('Sudoku')}
        >
          <span className="sudoku-icon">Sudoku</span>
        </div>
      </nav>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Game Locked</h2>
            <p>{popupMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Games;
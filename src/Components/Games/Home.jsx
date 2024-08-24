import React, { useState, useEffect } from "react";
import { WordPuzzleComponent } from "./WordPuzzleComponent";
import Confetti from "react-confetti";
import TaskLuminaLogo from '../images/TaskLuminaLogo.png';
import "../CSS Files/WordPuzzleComponent.css";
import { Link, useNavigate } from 'react-router-dom';

export const Home = () => {
  const easyMatrix = [
    ["D", "O", "G", "T", "A", "I", "L", "C", "A", "T"],
    ["B", "I", "R", "D", "H", "E", "A", "R", "T", "S"],
    ["F", "I", "S", "H", "M", "O", "L", "E", "D", "A"],
    ["C", "R", "O", "C", "O", "D", "I", "L", "E", "H"],
    ["A", "Z", "E", "B", "R", "A", "G", "I", "R", "A"],
    ["H", "E", "D", "G", "E", "H", "O", "G", "L", "O"],
    ["A", "N", "T", "E", "L", "O", "P", "E", "C", "B"],
    ["C", "H", "E", "E", "T", "A", "H", "S", "R", "H"],
    ["S", "N", "A", "K", "E", "S", "O", "W", "L", "S"],
    ["L", "I", "O", "N", "C", "R", "O", "W", "S", "M"],
  ];

  const mediumMatrix = [
    ["G", "I", "R", "A", "F", "F", "E", "S", "E", "A"],
    ["T", "I", "G", "E", "R", "S", "L", "I", "O", "N"],
    ["P", "A", "N", "D", "A", "S", "Z", "E", "B", "R"],
    ["M", "O", "L", "E", "S", "B", "E", "A", "R", "S"],
    ["R", "A", "T", "S", "S", "N", "A", "K", "E", "S"],
    ["H", "O", "R", "S", "E", "S", "C", "A", "T", "S"],
    ["F", "O", "X", "E", "S", "G", "I", "R", "L", "S"],
    ["D", "O", "G", "S", "F", "A", "W", "N", "S", "H"],
    ["A", "L", "P", "A", "C", "A", "B", "A", "D", "G"],
    ["P", "O", "L", "A", "R", "B", "E", "A", "R", "S"],
  ];

  const hardMatrix = [
    ["P", "E", "A", "C", "O", "C", "K", "S", "L", "I"],
    ["O", "R", "A", "N", "G", "U", "T", "A", "N", "S"],
    ["B", "A", "D", "G", "E", "R", "S", "R", "A", "C"],
    ["C", "H", "E", "E", "T", "A", "H", "S", "C", "L"],
    ["A", "N", "T", "E", "L", "O", "P", "E", "Z", "E"],
    ["H", "E", "D", "G", "E", "H", "O", "G", "L", "A"],
    ["B", "I", "R", "D", "S", "E", "M", "A", "C", "A"],
    ["P", "E", "N", "G", "U", "I", "N", "S", "T", "S"],
    ["D", "O", "G", "S", "C", "R", "O", "W", "S", "H"],
    ["L", "I", "O", "N", "S", "Z", "E", "B", "R", "A"],
  ];

  const easyWords = ["DOG", "CAT", "BIRD", "FISH", "MOLE", "CROCODILE", "ZEBRA", "HEDGEHOG", "ANTELOPE"];
  const mediumWords = [...easyWords, "CHEETAH", "SNAKE", "OWL", "LION", "CROW", "GIRAFFE", "TIGER", "PANDA", "HORSE", "FOX"];
  const hardWords = [...mediumWords, "PEACOCK", "ORANGUTAN", "BADGER", "PENGUIN"];

  const [difficulty, setDifficulty] = useState("easy");
  const [found, setFound] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [markedLetters, setMarkedLetters] = useState([]);
  const [isWinner, setIsWinner] = useState(false);
  const [path, setPath] = useState();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const navigate = useNavigate();

  const wordSets = { easy: easyWords, medium: mediumWords, hard: hardWords };
  const matrixSets = { easy: easyMatrix, medium: mediumMatrix, hard: hardMatrix };

  const answerWords = wordSets[difficulty];
  const matrix = matrixSets[difficulty];

  useEffect(() => {
    if (found.length === answerWords.length) {
      setIsWinner(true);
      setIsTimerRunning(false);
      setTimeTaken(timeLeft);
    }
  }, [found]);

  useEffect(() => {
    if (!isSelecting) {
      const selectedWord = selectedLetters.map((x) => x.letter).join("");
      addToFound(selectedWord);
    }
  }, [isSelecting]);

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setIsTimeUp(true);
    }
  }, [isTimerRunning, timeLeft]);

  const startGame = () => {
    setFound([]);
    setIsWinner(false);
    setIsTimeUp(false);
    setIsTimerRunning(true);
    switch (difficulty) {
      case "easy":
        setTimeLeft(60); // 1 minute for easy
        break;
      case "medium":
        setTimeLeft(90); // 1.5 minutes for medium
        break;
      case "hard":
        setTimeLeft(120); // 2 minutes for hard
        break;
      default:
        setTimeLeft(60);
    }
  };

  const addToFound = (founded) => {
    if (isInList(founded, answerWords)) {
      if (!isInList(founded, found)) {
        setFound([...found, founded]);
      }
    }
  };

  const isInList = (searched, arr) => arr.includes(searched);

  const closeWinnerPopup = () => {
    setIsWinner(false);
  };

  const closeTimeUpPopup = () => {
    setIsTimeUp(false);
  };

  const isBeforeSelect = (letter, before) => {
    let result = false;
    if (
      (letter.column + 1 === before.column && letter.row === before.row) ||
      (letter.column - 1 === before.column && letter.row === before.row) ||
      (letter.row + 1 === before.row && letter.column === before.column) ||
      (letter.row - 1 === before.row && letter.column === before.column)
    ) {
      result = true;
    }

    return result;
  };

  const chosePath = (item) => {
    let result = "left2right";
    const lastLetter = selectedLetters.slice(-2)[0];
    const letter = item !== undefined ? item : selectedLetters.slice(-1)[0];
    if (
      lastLetter.row === letter.row &&
      lastLetter.column - 1 === letter.column
    ) {
      result = "right2left";
    } else if (
      lastLetter.row === letter.row &&
      lastLetter.column + 1 === letter.column
    ) {
      result = "left2right";
    } else if (
      lastLetter.column === letter.column &&
      lastLetter.row + 1 === letter.row
    ) {
      result = "top2bottom";
    } else if (
      lastLetter.column === letter.column &&
      lastLetter.row - 1 === letter.row
    ) {
      result = "bottom2top";
    }

    return result;
  };

  return (
    <div className="home-container">
      <div className="head">
      <img src={TaskLuminaLogo} alt="TaskLumina Logo" className="logo2" />
      <div className="go-back-button-1" onClick={() => navigate('/games')}>
                 <span>Go Back to All Games</span>
                  </div>
                  </div>
      <div className="header1">
        
        <div className="game-title">WORDSMART</div>
      
      </div>
      <div className="herosection">
      <div style={{ display: "flex", textAlign: "center", flexDirection:"row", alignItems:"center"}}>
        <h2 style={{marginTop:"17px"}}> Select Difficulty  &nbsp; </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: difficulty === "easy" ? "green" : "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              setDifficulty("easy");
              setFound([]);
              setIsWinner(false);
              setIsTimeUp(false);
              setTimeLeft(60); // Reset time for easy
            }}
          >
            Easy
          </button>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: difficulty === "medium" ? "orange" : "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              setDifficulty("medium");
              setFound([]);
              setIsWinner(false);
              setIsTimeUp(false);
              setTimeLeft(90); // Reset time for medium
            }}
          >
            Medium
          </button>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: difficulty === "hard" ? "red" : "gray",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => {
              setDifficulty("hard");
              setFound([]);
              setIsWinner(false);
              setIsTimeUp(false);
              setTimeLeft(120); // Reset time for hard
            }}
          >
            Hard
          </button>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h2>Time Left: {timeLeft} seconds</h2>
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={startGame}
        >
          Start Game
        </button>
      </div>
      </div>
      <div className="game-play-container">
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <h3 style={{width:"180px"}}>Words to Find:</h3>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "15px" }}>
            {answerWords.map((element, index) => (
              <span
                key={index}
                style={{
                  color: isInList(element, found) ? "green" : "black",
                  textDecoration: isInList(element, found) ? "line-through" : "none",
                  fontSize: "1.2rem",
                  padding: "5px",
                }}
                
              >
                {element}
              </span>
            ))}
            {!isTimeUp && !isWinner && (
        <WordPuzzleComponent
          design={{
            markedBackgroundColor: "#00C3FF",
            selectedBackgroundColor: "white",
            hoveredBackgroundColor: "rgb(0, 218, 145)",
            backgroundColor: "rgb(255, 255, 255)",
            fontFamily: "monospace",
            fontWeight: "",
            fontSize: "2.5rem",
            markedForeColor: "white",
            selectedForeColor: "rgb(1, 146, 98)",
            hoveredForeColor: "white",
            foreColor: "black",
          }}
          options={{
            answerWords: answerWords,
            matrix: matrix,
            isSelecting: isSelecting,
            selectedLetters: selectedLetters,
            setSelectedLetters: setSelectedLetters,
            markedLetters: markedLetters,
            setMarkedLetters: setMarkedLetters,
            setIsSelecting: setIsSelecting,
            availablePaths: ["left2right", "top2bottom", "right2left", "bottom2top"],
          }}
          path={path}
          setPath={setPath}
          chosePath={chosePath}
          isBeforeSelect={isBeforeSelect}
        />
      )}
       {isTimeUp && (
        <div className="timeup-popup">
          <div className="timeup-content">
            <h1>Time's Up!</h1>
            <h2>You ran out of time.</h2>
            <button onClick={closeTimeUpPopup} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
          </div>
        </div>
        <div className="how-to-play">
          <h2>How to Play</h2>
          <p>
            Welcome to the Word Puzzle Game! The objective of the game is to find all the hidden words in the puzzle grid.
          </p>
          <ol className="instructions-list">
            <li>
              <span className="instruction-number">1.</span> Select a difficulty level (Easy, Medium, or Hard) and start the game.
            </li>
            <li>
              <span className="instruction-number">2.</span> Search for words in the grid. Words can be placed horizontally, vertically, or diagonally.
            </li>
            <li>
              <span className="instruction-number">3.</span> Click and drag to select the letters that form a word.
            </li>
            <li>
              <span className="instruction-number">4.</span> If you find all the words before the time runs out, you win the game!
            </li>
            <li>
              <span className="instruction-number">5.</span> Your time taken to complete the puzzle will be displayed once you find all the words.
            </li>
          </ol>
        </div>
      </div>
      
      {isWinner && (
        <div className="winner-popup">
          <Confetti />
          <div className="winner-content">
            <h1>Congratulations!</h1>
            <h2>You found all the words!</h2>
            <h3>Time Taken: {60 - timeTaken} seconds</h3>
            <button onClick={closeWinnerPopup} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default Home;
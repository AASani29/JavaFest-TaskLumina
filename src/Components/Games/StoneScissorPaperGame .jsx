import React, { useState } from "react";
import "../CSS Files/StoneScissorPaperGame.css";
import TaskLuminaLogo from "../Assets/images/TaskLuminaLogo.png";
import { Link, useNavigate } from "react-router-dom";

const StoneScissorPaperGame = () => {
  const [value, setValue] = useState(undefined);
  const [result, setResult] = useState(undefined);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState("");
  const navigate = useNavigate();

  const handleClick = (userVal) => {
    if (gameOver) return;

    const ssp = ["Stone", "Scissor", "Paper"];
    setValue(undefined);
    const rand = ssp[Math.floor(Math.random() * ssp.length)];

    setTimeout(() => {
      setValue(rand);
      const didUserWin = userWins(userVal, rand);
      let updatedUserScore = userScore;
      let updatedBotScore = botScore;

      // if (didUserWin === true) {
      //   setResult("You won!");
      //   updatedUserScore += 1;
      // } else if (didUserWin === false) {
      //   setResult("You lost!");
      //   updatedBotScore += 1;
      // } else {
      //   setResult("It's a tie!");
      // }
      if (userVal === rand) {
        // It's a tie, no points awarded
        setResult("It's a tie!");
      } else if (didUserWin === true) {
        setResult("You won!");
        updatedUserScore += 1;
      } else if (didUserWin === false) {
        setResult("You lost!");
        updatedBotScore += 1;
      }

      if (updatedUserScore === 5 || updatedBotScore === 5) {
        setGameOver(true);
        setWinner(updatedUserScore === 5 ? "User" : "Bot");
      }

      setUserScore(updatedUserScore);
      setBotScore(updatedBotScore);
    }, 500);
  };

  const userWins = (userVal, randVal) => {
    switch (userVal) {
      case "Stone":
        return randVal === "Scissor";
      case "Scissor":
        return randVal === "Paper";
      case "Paper":
        return randVal === "Stone";
      default:
        return null;
    }
  };

  const resetGame = () => {
    setValue(undefined);
    setResult(undefined);
    setUserScore(0);
    setBotScore(0);
    setGameOver(false);
    setWinner("");
  };

  return (
    <div className="taskluminalogo">
      <img src={TaskLuminaLogo} alt="Task Lumina Logo" className="logo" />

      <div className="game-container">
        <div className="game-content">
          <h1 className="game-title">Stone Scissor Paper</h1>
          <div className="scoreboard">
            <div className="score">User: {userScore}</div>
            <div className="score">Bot: {botScore}</div>
          </div>
          <div className="buttons">
            <button
              className="game-button"
              onClick={() => handleClick("Stone")}
              id="Stone"
            >
              <img
                src={require("../Assets/images/stone.png")}
                alt="Stone"
                width="80"
                height="80"
                className="images"
              />
              <br />
              Stone
            </button>
            <button
              className="game-button"
              onClick={() => handleClick("Scissor")}
              id="Scissor"
            >
              <img
                src={require("../Assets/images/scissor.png")}
                alt="Scissor"
                width="80"
                height="80"
                className="images"
              />
              <br />
              Scissor
            </button>
            <button
              className="game-button"
              onClick={() => handleClick("Paper")}
              id="Paper"
            >
              <img
                src={require("../Assets/images/paper.png")}
                alt="Paper"
                width="80"
                height="80"
                className="images"
              />
              <br />
              Paper
            </button>
          </div>

          <div className="bot-choice">
            <img
              src={require("../Assets/images/bot.png")}
              alt="Bot"
              width="90"
              height="90"
              className="images"
            />
            <b>Bot Chooses:</b>
            {value ? (
              <button
                className="game-button"
                id={value + "Ans"}
                disabled={true}
              >
                <img
                  src={require(`../Assets/images/${value.toLowerCase()}.png`)}
                  alt={value}
                  width="80"
                  height="80"
                  className="images"
                />
                <br />
                {value}
              </button>
            ) : (
              <div
                style={{
                  display: "inline-block",
                  width: "82px",
                  height: "82px",
                }}
                className="images"
              ></div>
            )}
          </div>

          <br />
          {result ? <span className="result">{result}</span> : null}

          <br />
          {gameOver && (
            <div className="game-over">
              <h2>{winner} Wins!</h2>
              <button className="reset-button" onClick={resetGame}>
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="game-instructions">
          <h2>How to Play</h2>
          <p>Welcome to the Stone Scissor Paper game! Here’s how you play:</p>
          <ol>
            <li>
              Select either Stone, Scissor, or Paper by clicking on the
              corresponding button.
            </li>
            <li>
              The bot will randomly select one of the three options as well.
            </li>
            <li>
              The winner is determined by the following rules:
              <ul>
                <li>Stone crushes Scissor</li>
                <li>Scissor cuts Paper</li>
                <li>Paper covers Stone</li>
              </ul>
            </li>
            <li>
              If you win, you earn a point. If the bot wins, it earns a point.
            </li>
            <li>The first to score 5 points wins the game!</li>
          </ol>
          <p>Good luck, and may the best player win!</p>
        </div>
      </div>
      <div className="go-back-button" onClick={() => navigate("/games")}>
        <span>Go Back to All Games</span>
      </div>
    </div>
  );
};

export default StoneScissorPaperGame;

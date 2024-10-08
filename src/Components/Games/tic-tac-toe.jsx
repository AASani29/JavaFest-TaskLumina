// tic-tac-toe.jsx
import React, { useState, useEffect } from "react";
import "../CSS Files/tic-tac-toe.css";
import Board from "../Games/Board";
import Square from "../Games/Square";
import "react-router-dom";
import Logo from "../Assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
const defaultSquares = () => new Array(9).fill(null);

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function TicTacToe() {
  const navigate = useNavigate();
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
  const [winsLossesDraws, setWinsLossesDraws] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
  });

  let isPlayerWon = false;
  useEffect(() => {
    const linesThatAre = (a, b, c) => {
      return lines.filter((squareIndexes) => {
        const squareValues = squareIndexes.map((index) => squares[index]);
        return (
          JSON.stringify([a, b, c].sort()) ===
          JSON.stringify(squareValues.sort())
        );
      });
    };
    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);
    const playerWon = linesThatAre("x", "x", "x").length > 0;
    const computerWon = linesThatAre("o", "o", "o").length > 0;

    if (playerWon) {
      setWinner("x");
      setWinsLossesDraws((winsLossesDraws) => ({
        ...winsLossesDraws,
        wins: winsLossesDraws.wins + 1,
      }));
      isPlayerWon = true;
    } else if (computerWon) {
      setWinner("o");
      setWinsLossesDraws((winsLossesDraws) => ({
        ...winsLossesDraws,
        losses: winsLossesDraws.losses + 1,
      }));
    } else if (emptyIndexes.length === 0) {
      setWinner("draw");
      setWinsLossesDraws((winsLossesDraws) => ({
        ...winsLossesDraws,
        draws: winsLossesDraws.draws + 1,
      }));
    }

    const putComputerAt = (index) => {
      setSquares((prevSquare) => {
        let newSquares = [...prevSquare];
        newSquares[index] = "o";
        return newSquares;
      });
    };

    const isComputerTurn =
      squares.filter((square) => square !== null).length % 2 === 1;
    if (isComputerTurn && !isPlayerWon) {
      // COMPUTER PUT 'O' TO WIN THE GAME //
      const winningLines = linesThatAre("o", "o", null);
      if (winningLines.length > 0) {
        const winIndex = winningLines[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(winIndex);
        return;
      }

      // COMPUTER PUT 'O' TO BLOCK THE PLAYER //
      const linesToBlock = linesThatAre("x", "x", null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(blockIndex);
        return;
      }

      // COMPUTER PUT 'O' TO INCREASE THE CHANCE OF WINNING THE GAME //
      const linesToContinue = linesThatAre("o", null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(
          linesToContinue[0].filter((index) => squares[index] === null)[0]
        );
        return;
      }

      // COMPUTER PUT 'O' TO A RANDOM PLAYER WHEN GAME BEGINS (only executing when it is computer's first put) //
      const randomIndex =
        emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      if (emptyIndexes.length > 0) {
        putComputerAt(randomIndex);
      }
    }
  }, [squares]);

  function handleSquareClick(index) {
    const isPlayerTurn =
      squares.filter((square) => square !== null).length % 2 === 0;
    if (isPlayerTurn && winner === null) {
      const newSquares = squares.slice();
      newSquares[index] = "x";
      setSquares(newSquares);
    }
  }

  const resetBoard = () => {
    setSquares(new Array(9).fill(null));
    setWinner(null);
  };

  return (
    <main className="mainclass">
      <nav className="sidebartictactoe">
        <div className="logo-container" onClick={() => navigate("/dashboard")}>
          <img src={Logo} alt="Logo" className="logo1" />
        </div>
        <h1>Tic Tac Toe</h1>
        <Board>
          {squares.map((square, index) => (
            <Square
              key={index}
              x={square === "x" ? 1 : 0}
              o={square === "o" ? 1 : 0}
              onClick={() => handleSquareClick(index)}
            />
          ))}
        </Board>
        <h3>
          Wins: {winsLossesDraws.wins} Losses: {winsLossesDraws.losses} Draws:{" "}
          {winsLossesDraws.draws}
        </h3>
        <div className="go-back-button" onClick={() => navigate("/games")}>
          <span>Go Back to All Games</span>
        </div>
        {!!winner && winner === "x" && (
          <div className="result green">
            You WON!
            <button onClick={resetBoard}>Reset</button>
          </div>
        )}
        {!!winner && winner === "o" && (
          <div className="result red">
            You LOST!
            <button onClick={resetBoard}>Reset</button>
          </div>
        )}
        {!!winner && winner === "draw" && (
          <div className="result gray">
            It's a DRAW!
            <button onClick={resetBoard}>Reset</button>
          </div>
        )}
      </nav>
    </main>
  );
}

export default TicTacToe;

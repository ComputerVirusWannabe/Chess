import React, { useState } from 'react';
import { initialBoard } from './AI/board.js';
import Board from './displayBoard.js';

export default function App() {
  const [board, setBoard] = useState(initialBoard);

  const handleSquareClick = (row, col) => {
    console.log('Clicked square:', row, col);
    // Here you will handle piece selection and moves later
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Chess App</h1>
      <Board board={board} onSquareClick={handleSquareClick} />
    </div>
  );
}

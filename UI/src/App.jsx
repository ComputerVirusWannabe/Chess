import React, { useState } from 'react';
import { initialBoard } from './AI/board.js';
import Board from './Board';

export default function App() {
  const [board, setBoard] = useState(initialBoard);

  const handleSquareClick = (row, col) => {
    console.log('Clicked', row, col, board[row][col]);
    // You’ll add move logic here
  };

  return (
    <div className="flex justify-center mt-10">
      <Board board={board} onSquareClick={handleSquareClick} />
    </div>
  );
}

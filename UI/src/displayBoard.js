import React from 'react';

// Simple helper to display piece symbols by type and color
const pieceSymbols = {
  pawn:   { white: '♙', black: '♟' },
  rook:   { white: '♖', black: '♜' },
  knight: { white: '♘', black: '♞' },
  bishop: { white: '♗', black: '♝' },
  queen:  { white: '♕', black: '♛' },
  king:   { white: '♔', black: '♚' },
};

export default function Board({ board, onSquareClick }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(8, 50px)', 
      width: '400px', 
      border: '2px solid black' 
    }}>x``
      {board.map((row, r) =>
        row.map((piece, c) => {
          const isLightSquare = (r + c) % 2 === 1;
          const backgroundColor = isLightSquare ? '#eee' : '#444';
          const pieceSymbol = piece ? pieceSymbols[piece.type][piece.color] : null;

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => onSquareClick(r, c)}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor,
                color: piece && piece.color === 'white' ? 'black' : 'white',
                fontSize: '32px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {pieceSymbol}
            </div>
          );
        })
      )}
    </div>
  );
}

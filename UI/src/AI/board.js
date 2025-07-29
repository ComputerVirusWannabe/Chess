let pieceCounter = { white: {}, black: {} };

// Helper function to generate unique IDs and piece objects
const createPiece = (type, color) => {
  if (!pieceCounter[color][type]) {
    pieceCounter[color][type] = 0;
  }

  const id = `${color}-${type}-${pieceCounter[color][type]++}`;
  return {
    id,
    type,      // 'pawn', 'rook', etc.
    color,     // 'white' or 'black'
    hasMoved: false,
  };
};

// Initializes and exports the starting board
export const initialBoard = [
  [
    createPiece('rook', 'black'),
    createPiece('knight', 'black'),
    createPiece('bishop', 'black'),
    createPiece('queen', 'black'),
    createPiece('king', 'black'),
    createPiece('bishop', 'black'),
    createPiece('knight', 'black'),
    createPiece('rook', 'black'),
  ],
  Array.from({ length: 8 }, () => createPiece('pawn', 'black')), // Black pawns
  Array(8).fill(null), // Empty row
  Array(8).fill(null), 
  Array(8).fill(null), 
  Array(8).fill(null), 
  Array.from({ length: 8 }, () => createPiece('pawn', 'white')), // White pawns
  [
    createPiece('rook', 'white'),
    createPiece('knight', 'white'),
    createPiece('bishop', 'white'),
    createPiece('queen', 'white'),
    createPiece('king', 'white'),
    createPiece('bishop', 'white'),
    createPiece('knight', 'white'),
    createPiece('rook', 'white'),
  ],
];
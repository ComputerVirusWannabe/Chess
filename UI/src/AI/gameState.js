import { isOpponentPiece } from './generate.js';

const initialGameState = {
  whiteToMove: true,
  enPassantTarget: null,
  castlingRights: {
    whiteKingside: true,
    whiteQueenside: true,
    blackKingside: true,
    blackQueenside: true,
  },
  halfMoveClock: 0,
  fullMoveNumber: 1,
};

function isSquareAttacked(board, square, isWhite) {
  const { row, col } = square;
  const opponentColor = isWhite ? 'black' : 'white';

  // Check for pawn attacks
  const pawnOffsets = isWhite
    ? [{ row: -1, col: -1 }, { row: -1, col: 1 }]
    : [{ row: 1, col: -1 }, { row: 1, col: 1 }];
  for (const offset of pawnOffsets) {
    const [r, c] = [row + offset.row, col + offset.col];
    if (isValidSquare(r, c)) {
      const piece = board[r][c];
      if (
        piece &&
        piece.type === 'pawn' &&
        piece.color === opponentColor
      ) {
        return true;
      }
    }
  }

  // Check for knight attacks
  const knightOffsets = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 },
  ];
  for (const offset of knightOffsets) {
    const [r, c] = [row + offset.row, col + offset.col];
    if (isValidSquare(r, c)) {
      const piece = board[r][c];
      if (
        piece &&
        piece.type === 'knight' &&
        piece.color === opponentColor
      ) {
        return true;
      }
    }
  }

  // Sliding pieces: bishop, rook, queen
  const slidingPieceOffsets = {
    bishop: [
      { row: -1, col: -1 }, { row: -1, col: 1 },
      { row: 1, col: -1 }, { row: 1, col: 1 },
    ],
    rook: [
      { row: -1, col: 0 }, { row: 1, col: 0 },
      { row: 0, col: -1 }, { row: 0, col: 1 },
    ],
    queen: [
      { row: -1, col: -1 }, { row: -1, col: 1 },
      { row: 1, col: -1 }, { row: 1, col: 1 },
      { row: -1, col: 0 }, { row: 1, col: 0 },
      { row: 0, col: -1 }, { row: 0, col: 1 },
    ]
  };

  for (const [type, directions] of Object.entries(slidingPieceOffsets)) {
    for (const offset of directions) {
      let [r, c] = [row + offset.row, col + offset.col];
      while (isValidSquare(r, c)) {
        const piece = board[r][c];
        if (piece) {
          if (
            piece.color === opponentColor &&
            (piece.type === type || piece.type === 'queen')
          ) {
            return true;
          }
          break; // blocked
        }
        r += offset.row;
        c += offset.col;
      }
    }
  }

  // Check for king attacks
  const kingOffsets = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 },                   { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
  ];
  for (const offset of kingOffsets) {
    const [r, c] = [row + offset.row, col + offset.col];
    if (isValidSquare(r, c)) {
      const piece = board[r][c];
      if (
        piece &&
        piece.type === 'king' &&
        piece.color === opponentColor
      ) {
        return true;
      }
    }
  }

  return false;
}

function isValidSquare(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export { initialGameState, isSquareAttacked, isValidSquare };

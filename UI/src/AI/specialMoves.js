import { createPiece } from './board.js';


export function handleEnPassant(board, move, gameState) {
  const { from, to, piece } = move;
  let newGameState = { ...gameState };

  // Set en passant target on two-square pawn advance
  if (piece.type === 'pawn' && Math.abs(from.row - to.row) === 2) {
    newGameState.enPassantTarget = { row: Math.floor((from.row + to.row) / 2), col: from.col };
  } else {
    newGameState.enPassantTarget = null;
  }

  // Perform en passant capture if applicable
  if (move.enPassant) {
    const captureRow = from.row + (piece.color === 'white' ? -1 : 1);
    board[captureRow][to.col] = null; // Empty square after capture
  }

  return newGameState;
}

  
export function handleCastling(board, move) {
  const { from, to, piece } = move;

  if (piece.type === 'king' && Math.abs(from.col - to.col) === 2) {
    const rookFromCol = to.col > from.col ? 7 : 0;
    const rookToCol = to.col > from.col ? to.col - 1 : to.col + 1;

    const rook = board[from.row][rookFromCol];
    board[from.row][rookToCol] = rook;
    board[from.row][rookFromCol] = null; // Empty old rook square

    if (rook) {
      rook.hasMoved = true;
    }
  }
}


export function handlePawnPromotion(board, move) {
  const { to, promotion, piece } = move;

  if (promotion && piece.type === 'pawn') {
    const color = piece.color;
    // Promotion letter is likely uppercase or lowercase, map it to type:
    const promoMap = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight' };
    const promoType = promoMap[promotion.toLowerCase()] || 'queen';

    if (promoType) {
      board[to.row][to.col] = createPiece(promoType, color);
    }
  }
}
  
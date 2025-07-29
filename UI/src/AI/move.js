import { generateMoves } from './generate.js';
import { handleEnPassant, handleCastling, handlePawnPromotion } from './specialMoves.js';


export function findBestMove(board, gameState, depth, isWhiteTurn, generateAllMovesFn, minimaxFn) {
  const moves = generateAllMovesFn(board, isWhiteTurn);
  let bestMove = null;
  let bestScore = isWhiteTurn ? -Infinity : Infinity;

  for (const move of moves) {
    const { board: newBoard, gameState: newGameState } = makeMove(board, move, gameState);
    const score = minimaxFn(newBoard, depth - 1, -Infinity, Infinity, !isWhiteTurn);

    if (isWhiteTurn ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}


export function makeMove(board, move, gameState) {
  const { from, to, piece } = move;

  // Deep copy board and pieces
  const newBoard = board.map(row => row.map(p => (p ? { ...p } : null)));

  // Shallow copy gameState, and deep copy enPassantTarget
  let newGameState = {
    ...gameState,
    enPassantTarget: gameState.enPassantTarget
      ? { ...gameState.enPassantTarget }
      : null,
  };

  // Move piece and mark as moved
  newBoard[to.row][to.col] = { ...piece, hasMoved: true };
  newBoard[from.row][from.col] = null;

  // Set promotion flag before promotion logic
  if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
    if (!move.promotion) move.promotion = 'q';
  }

  // Handle special moves
  newGameState = handleEnPassant(newBoard, move, newGameState);
  handleCastling(newBoard, move);
  handlePawnPromotion(newBoard, move);

  // Update castling rights
  if (piece.type === 'king') {
    if (piece.color === 'white') {
      newGameState.whiteCanCastleKingside = false;
      newGameState.whiteCanCastleQueenside = false;
    } else {
      newGameState.blackCanCastleKingside = false;
      newGameState.blackCanCastleQueenside = false;
    }
  } else if (piece.type === 'rook') {
    if (piece.color === 'white') {
      if (from.row === 7 && from.col === 0) newGameState.whiteCanCastleQueenside = false;
      if (from.row === 7 && from.col === 7) newGameState.whiteCanCastleKingside = false;
    } else {
      if (from.row === 0 && from.col === 0) newGameState.blackCanCastleQueenside = false;
      if (from.row === 0 && from.col === 7) newGameState.blackCanCastleKingside = false;
    }
  }

  return { board: newBoard, gameState: newGameState };
}

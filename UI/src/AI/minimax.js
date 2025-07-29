import { generateAllMoves, isOpponentPiece } from './generate.js';
import { evaluateBoard } from './evaluate.js';
import { makeMove } from './move.js';

// Transposition table to store already evaluated positions
export const transpositionTable = new Map();

// Function to hash the board state - uses full piece ID and hasMoved flag for uniqueness
function hashBoard(board) {
  return board
    .map(row =>
      row
        .map(cell => {
          if (!cell) return '.';
          return `${cell.id}${cell.hasMoved ? 'm' : 'n'}`; // e.g. white-pawn-0m
        })
        .join(',')
    )
    .join('/');
}

// Quiescence search to handle unstable positions like captures
function quiescenceSearch(board, alpha, beta, isMaximizingPlayer) {
  const standPat = evaluateBoard(board);

  if (isMaximizingPlayer) {
    if (standPat >= beta) return beta;
    alpha = Math.max(alpha, standPat);
  } else {
    if (standPat <= alpha) return alpha;
    beta = Math.min(beta, standPat);
  }

  const tacticalMoves = generateAllMoves(board, isMaximizingPlayer).filter(move =>
    isTacticalMove(board, move)
  );

  for (const move of tacticalMoves) {
    const { board: newBoard } = makeMove(board, move);
    const score = quiescenceSearch(newBoard, alpha, beta, !isMaximizingPlayer);

    if (isMaximizingPlayer) {
      alpha = Math.max(alpha, score);
      if (alpha >= beta) break;
    } else {
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
  }

  return isMaximizingPlayer ? alpha : beta;
}

// Clears the transposition table
export function resetTranspositionTable() {
  transpositionTable.clear();
}

// Minimax with alpha-beta pruning and quiescence search
export function minimax(board, depth, alpha, beta, isMaximizingPlayer) {
  const key = hashBoard(board) + `|${depth}|${isMaximizingPlayer}`;

  if (transpositionTable.has(key)) {
    return transpositionTable.get(key);
  }

  if (depth === 0) {
    return quiescenceSearch(board, alpha, beta, isMaximizingPlayer);
  }

  const moves = generateAllMoves(board, isMaximizingPlayer);

  if (moves.length === 0) {
    // No legal moves = checkmate or stalemate
    const terminalScore = isMaximizingPlayer ? -Infinity : Infinity;
    transpositionTable.set(key, terminalScore);
    return terminalScore;
  }

  // Move ordering for better pruning
  const scoredMoves = moves.map(move => {
    const { board: newBoard } = makeMove(board, move);
    const score = evaluateBoard(newBoard);
    return { move, score };
  });

  scoredMoves.sort((a, b) =>
    isMaximizingPlayer ? b.score - a.score : a.score - b.score
  );

  const sortedMoves = scoredMoves.map(s => s.move);

  let bestScore = isMaximizingPlayer ? -Infinity : Infinity;
  let isFirst = true;

  for (const move of sortedMoves) {
    const { board: newBoard } = makeMove(board, move);
    let score;

    if (isFirst) {
      score = minimax(newBoard, depth - 1, alpha, beta, !isMaximizingPlayer);
      isFirst = false;
    } else {
      // Null-window search (Principal Variation Search)
      score = minimax(newBoard, depth - 1, alpha, alpha + 1, !isMaximizingPlayer);
      if (score > alpha && score < beta) {
        score = minimax(newBoard, depth - 1, alpha, beta, !isMaximizingPlayer);
      }
    }

    if (isMaximizingPlayer) {
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, score);
    } else {
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, score);
    }

    if (beta <= alpha) break; // Alpha-beta pruning
  }

  transpositionTable.set(key, bestScore);
  return bestScore;
}

// Helper to detect if a move is tactical (capture or check)
function isTacticalMove(board, move) {
  const target = board[move.to.row][move.to.col];
  if (!target) return false;

  const piece = board[move.from.row][move.from.col];
  if (!piece) return false;

  return isOpponentPiece(target, piece.color);
}

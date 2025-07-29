import { isSquareAttacked } from './gameState.js';
import { makeMove } from './move.js';

// Check if the target square contains an opponent's piece
export function isOpponentPiece(target, isWhite) {
  return target && target.color !== (isWhite ? 'white' : 'black');
}

function addPromotionMoves(moves, from, to, piece, captured, isWhite) {
  for (const promo of ['queen', 'rook', 'bishop', 'knight']) {
    moves.push({
      from,
      to,
      piece,
      captured,
      promotion: promo,
      color: piece.color,
    });
  }
}

function addDirectionalMoves(board, piece, position, directions, isWhite) {
  const { row, col } = position;
  const moves = [];

  for (const [dRow, dCol] of directions) {
    let newRow = row + dRow;
    let newCol = col + dCol;

    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const target = board[newRow][newCol];
      if (!target) {
        moves.push({ from: { row, col }, to: { row: newRow, col: newCol }, piece });
      } else {
        if (isOpponentPiece(target, isWhite)) {
          moves.push({ from: { row, col }, to: { row: newRow, col: newCol }, piece, captured: target });
        }
        break; // Stop at the first piece encountered
      }
      newRow += dRow;
      newCol += dCol;
    }
  }

  return moves;
}

function generatePawnMoves(board, piece, position, enPassantTarget) {
  const { row, col } = position;
  const moves = [];
  const isWhite = piece.color === 'white';
  const direction = isWhite ? -1 : 1;
  const startRow = isWhite ? 6 : 1;
  const nextRow = row + direction;

  // Forward move
  if (board[nextRow]?.[col] === null) {
    if (nextRow === 0 || nextRow === 7) {
      addPromotionMoves(moves, { row, col }, { row: nextRow, col }, piece, null, isWhite);
    } else {
      moves.push({ from: { row, col }, to: { row: nextRow, col }, piece, captured: null });
    }

    // Double forward
    const twoStepRow = row + 2 * direction;
    if (row === startRow && board[twoStepRow]?.[col] === null) {
      moves.push({ from: { row, col }, to: { row: twoStepRow, col }, piece, captured: null });
    }
  }

  // Captures (left and right)
  for (let dcol of [-1, 1]) {
    const newCol = col + dcol;
    const target = board[nextRow]?.[newCol];
    if (isOpponentPiece(target, isWhite)) {
      if (nextRow === 0 || nextRow === 7) {
        addPromotionMoves(moves, { row, col }, { row: nextRow, col: newCol }, piece, target, isWhite);
      } else {
        moves.push({ from: { row, col }, to: { row: nextRow, col: newCol }, piece, captured: target });
      }
    }
  }

  // En passant
  if (enPassantTarget && nextRow === enPassantTarget.row && Math.abs(col - enPassantTarget.col) === 1) {
    const capturedPawn = board[row][enPassantTarget.col];
    if (
      capturedPawn &&
      capturedPawn.type === 'pawn' &&
      isWhite !== (capturedPawn.color === 'white') &&
      board[nextRow][enPassantTarget.col] === null
    ) {
      moves.push({
        from: { row, col },
        to: { row: enPassantTarget.row, col: enPassantTarget.col },
        piece,
        captured: capturedPawn,
        enPassant: true
      });
    }
  }

  return moves;
}

function generateKnightMoves(board, piece, position) {
  const { row, col } = position;
  const isWhite = piece.color === 'white';
  const knightMoves = [
    { row: row - 2, col: col - 1 }, { row: row - 2, col: col + 1 },
    { row: row - 1, col: col - 2 }, { row: row - 1, col: col + 2 },
    { row: row + 1, col: col - 2 }, { row: row + 1, col: col + 2 },
    { row: row + 2, col: col - 1 }, { row: row + 2, col: col + 1 }
  ];

  return knightMoves
    .filter(move => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8)
    .map(move => {
      const target = board[move.row]?.[move.col];
      if (!target || isOpponentPiece(target, isWhite)) {
        return { from: { row, col }, to: move, piece, captured: target || null };
      }
    })
    .filter(Boolean);
}

function isValidSquare(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function generateKingMoves(board, kingPosition, isWhite, gameState) {
  const { row, col } = kingPosition;
  const moves = [];

  // Standard king moves (one square any direction)
  const kingOffsets = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 },                  { row: 0, col: 1 },
    { row: 1, col: -1 },  { row: 1, col: 0 }, { row: 1, col: 1 }
  ];

  for (const offset of kingOffsets) {
    const targetRow = row + offset.row;
    const targetCol = col + offset.col;
    if (isValidSquare(targetRow, targetCol)) {
      const targetSquare = board[targetRow][targetCol];
      if (!targetSquare || isOpponentPiece(targetSquare, isWhite)) {
        // Don't move into attacked squares
        if (!isSquareAttacked(board, { row: targetRow, col: targetCol }, isWhite)) {
          moves.push({
            from: kingPosition,
            to: { row: targetRow, col: targetCol },
            piece: board[row][col],
            captured: targetSquare || null
          });
        }
      }
    }
  }

  // Castling moves
  if (isWhite) {
    // White kingside
    if (gameState.whiteCanCastleKingside &&
        !board[7][5] && !board[7][6] &&
        !isSquareAttacked(board, { row: 7, col: 4 }, true) &&
        !isSquareAttacked(board, { row: 7, col: 5 }, true) &&
        !isSquareAttacked(board, { row: 7, col: 6 }, true)) {
      moves.push({ from: kingPosition, to: { row: 7, col: 6 }, castling: 'kingside' });
    }
    // White queenside
    if (gameState.whiteCanCastleQueenside &&
        !board[7][1] && !board[7][2] && !board[7][3] &&
        !isSquareAttacked(board, { row: 7, col: 4 }, true) &&
        !isSquareAttacked(board, { row: 7, col: 3 }, true) &&
        !isSquareAttacked(board, { row: 7, col: 2 }, true)) {
      moves.push({ from: kingPosition, to: { row: 7, col: 2 }, castling: 'queenside' });
    }
  } else {
    // Black kingside
    if (gameState.blackCanCastleKingside &&
        !board[0][5] && !board[0][6] &&
        !isSquareAttacked(board, { row: 0, col: 4 }, false) &&
        !isSquareAttacked(board, { row: 0, col: 5 }, false) &&
        !isSquareAttacked(board, { row: 0, col: 6 }, false)) {
      moves.push({ from: kingPosition, to: { row: 0, col: 6 }, castling: 'kingside' });
    }
    // Black queenside
    if (gameState.blackCanCastleQueenside &&
        !board[0][1] && !board[0][2] && !board[0][3] &&
        !isSquareAttacked(board, { row: 0, col: 4 }, false) &&
        !isSquareAttacked(board, { row: 0, col: 3 }, false) &&
        !isSquareAttacked(board, { row: 0, col: 2 }, false)) {
      moves.push({ from: kingPosition, to: { row: 0, col: 2 }, castling: 'queenside' });
    }
  }

  return moves;
}

function generateSlidingPieceMoves(board, piece, position) {
  const isWhite = piece.color === 'white';
  let directions;

  switch (piece.type) {
    case 'bishop':
      directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      break;
    case 'rook':
      directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      break;
    case 'queen':
      directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      break;
    default:
      return [];
  }

  return addDirectionalMoves(board, piece, position, directions, isWhite);
}

// Main move generator function
export function generateMoves(board, piece, position, gameState, enPassantTarget = null) {
  switch (piece.type) {
    case 'pawn':
      return generatePawnMoves(board, piece, position, enPassantTarget);
    case 'knight':
      return generateKnightMoves(board, piece, position);
    case 'king':
      return generateKingMoves(board, position, piece.color === 'white', gameState);
    case 'bishop':
    case 'rook':
    case 'queen':
      return generateSlidingPieceMoves(board, piece, position);
    default:
      return [];
  }
}

export function generateAllMoves(board, isWhiteTurn, gameState, generateMovesFn = generateMoves) {
  const allLegalMoves = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const isWhitePiece = piece.color === 'white';
      if (isWhitePiece !== isWhiteTurn) continue;

      const moves = generateMovesFn(board, piece, { row, col }, gameState);

      for (const move of moves) {
        const { board: newBoard, gameState: newState } = makeMove(board, move, gameState);
        if (!isKingInCheck(newBoard, isWhiteTurn)) {
          allLegalMoves.push(move);
        }
      }
    }
  }

  return allLegalMoves;
}

function isKingInCheck(board, isWhite) {
  const kingColor = isWhite ? 'white' : 'black';
  let kingPos = null;

  // Find the king position
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === kingColor) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return true; // No king means in check (invalid)

  // Check if any opponent piece attacks the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const attacker = board[row][col];
      if (!attacker) continue;
      if (attacker.color === kingColor) continue;

      const threats = generateMoves(board, attacker, { row, col }, null);
      for (const move of threats) {
        if (move.to.row === kingPos.row && move.to.col === kingPos.col) {
          return true;
        }
      }
    }
  }

  return false;
}

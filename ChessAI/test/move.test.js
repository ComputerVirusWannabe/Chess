import { makeMove } from '../../UI/src/src/move.js';

describe('makeMove', () => {
  let initialBoard;
  let initialGameState;

  beforeEach(() => {
    // Mock initial board and game state
    initialBoard = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['.', '.', '.', '.', '.', '.', '.', '.'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

    initialGameState = {
      whiteToMove: true,
      fullMoveNumber: 1,
      halfMoveClock: 0,
      castlingRights: {
        whiteKingside: true,
        whiteQueenside: true,
        blackKingside: true,
        blackQueenside: true,
      },
    };
  });

  test('makes a basic pawn move and toggles turn', () => {
    const move = {
      from: { row: 6, col: 4 }, // e2
      to: { row: 4, col: 4 },   // e4
      piece: 'P',
    };

    const { board, gameState } = makeMove(initialBoard, move, initialGameState);

    expect(board[6][4]).toBe('.'); // e2 is now empty
    expect(board[4][4]).toBe('P'); // e4 now has the pawn
    expect(gameState.whiteToMove).toBe(false); // Black's turn
    expect(gameState.fullMoveNumber).toBe(1); // Full move number unchanged
  });

  test('increments full move number after black moves', () => {
    initialGameState.whiteToMove = false; // Black's turn
    const move = {
      from: { row: 1, col: 4 }, // e7
      to: { row: 3, col: 4 },   // e5
      piece: 'p',
    };

    const { gameState } = makeMove(initialBoard, move, initialGameState);

    expect(gameState.whiteToMove).toBe(true); // White's turn
    expect(gameState.fullMoveNumber).toBe(2); // Full move number incremented
  });

  test('resets half-move clock on pawn move', () => {
    const move = {
      from: { row: 6, col: 4 }, // e2
      to: { row: 4, col: 4 },   // e4
      piece: 'P',
    };

    const { gameState } = makeMove(initialBoard, move, initialGameState);

    expect(gameState.halfMoveClock).toBe(0); // Half-move clock reset
  });

  test('updates castling rights after king moves', () => {
    const move = {
      from: { row: 7, col: 4 }, // e1
      to: { row: 7, col: 5 },   // f1
      piece: 'K',
    };

    const { gameState } = makeMove(initialBoard, move, initialGameState);

    expect(gameState.castlingRights.whiteKingside).toBe(false);
    expect(gameState.castlingRights.whiteQueenside).toBe(false);
  });

  test('updates castling rights after rook moves', () => {
    const move = {
      from: { row: 7, col: 0 }, // a1
      to: { row: 7, col: 3 },   // d1
      piece: 'R',
    };

    const { gameState } = makeMove(initialBoard, move, initialGameState);

    expect(gameState.castlingRights.whiteQueenside).toBe(false);
    expect(gameState.castlingRights.whiteKingside).toBe(true);
  });

  test('handles pawn promotion', () => {
    initialBoard[1][0] = 'P'; // White pawn on a7
    const move = {
      from: { row: 1, col: 0 }, // a7
      to: { row: 0, col: 0 },   // a8
      piece: 'P',
      promotion: 'Q',           // Promote to queen
    };

    const { board } = makeMove(initialBoard, move, initialGameState);

    expect(board[0][0]).toBe('Q'); // Pawn promoted to queen
    expect(board[1][0]).toBe('.'); // Original position is empty
  });
});
import { generateMoves, generateAllMoves } from '../src/generate.js';
import { makeMove } from '../src/move.js';

const emptyBoard = () => Array(8).fill().map(() => Array(8).fill('.'));

describe('generateMoves', () => {
    test('generates a single forward move for a pawn on its initial position', () => {
      const board = emptyBoard();
      board[6][4] = 'P'; // White pawn on e2
  
      const moves = generateMoves(board, 'P', { row: 6, col: 4 }, {}, null);
      const toSquares = moves.map(m => m.to);
  
      expect(toSquares).toContainEqual({ row: 5, col: 4 }); // e3
    });
  
    test('generates a double forward move for a pawn on its initial position', () => {
      const board = emptyBoard();
      board[6][4] = 'P'; // White pawn on e2
  
      const moves = generateMoves(board, 'P', { row: 6, col: 4 }, {}, null);
      const toSquares = moves.map(m => m.to);
  
      expect(toSquares).toContainEqual({ row: 4, col: 4 }); // e4
    });
  
    test('does not generate moves for a pawn blocked by another piece', () => {
      const board = emptyBoard();
      board[6][4] = 'P'; // White pawn on e2
      board[5][4] = 'p'; // Black pawn on e3
  
      const moves = generateMoves(board, 'P', { row: 6, col: 4 }, {}, null);
      const toSquares = moves.map(m => m.to);
  
      expect(toSquares).not.toContainEqual({ row: 5, col: 4 }); // e3
      expect(toSquares).not.toContainEqual({ row: 4, col: 4 }); // e4
    });
  
    test('generates diagonal capture moves for a pawn', () => {
      const board = emptyBoard();
      board[6][4] = 'P'; // White pawn on e2
      board[5][3] = 'p'; // Black pawn on d3
      board[5][5] = 'p'; // Black pawn on f3
  
      const moves = generateMoves(board, 'P', { row: 6, col: 4 }, {}, null);
      const toSquares = moves.map(m => m.to);
  
      expect(toSquares).toContainEqual({ row: 5, col: 3 }); // d3
      expect(toSquares).toContainEqual({ row: 5, col: 5 }); // f3
    });

    test('generates promotion moves when pawn reaches 7th rank', () => {
        const board = emptyBoard();
        board[1][4] = 'P'; // White pawn on e7
      
        const moves = generateMoves(board, 'P', { row: 1, col: 4 }, {}, null);
        const promotions = moves.map(m => m.promotion).filter(Boolean);
      
        expect(promotions).toEqual(expect.arrayContaining(['q', 'r', 'b', 'n']));
      });
      

  });
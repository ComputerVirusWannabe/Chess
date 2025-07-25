import { generateMoves } from '../ChessAI/src/generate.js';
import { makeMove } from '../ChessAI/src/move.js';
import { initialGameState } from '../ChessAI/src/gameState.js';
import { initialBoard } from '../ChessAI/src/board.js';

let board = initialBoard.map(row => [...row]);   // clone 2d array
let gameState = { ...initialGameState };         // shallow clone object

let selected = null; // Track clicked piece
let validMoves = [];


const boardContainer = document.getElementById('board');

function renderBoard() {
  boardContainer.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.className = 'square ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = row;
      square.dataset.col = col;

      // Highlight selected square
      if (selected && selected.row === row && selected.col === col) {
        square.classList.add('selected');
      }

      // Highlight valid moves squares
      if (validMoves.some(m => m.to.row === row && m.to.col === col)) {
        square.classList.add('valid-move');
      }

      const piece = board[row][col];
      if (piece && piece !== '.') {
        const pieceDiv = document.createElement('div');
        pieceDiv.className = 'piece';
        pieceDiv.textContent = piece;
        square.appendChild(pieceDiv);
      }

      boardContainer.appendChild(square);
    }
  }
}

function handleSquareClick(e) {
  let target = e.target;

  if (!target.dataset.row || !target.dataset.col) {
    target = target.closest('.square');
    if (!target) return;
  }

  const row = parseInt(target.dataset.row);
  const col = parseInt(target.dataset.col);
  if (isNaN(row) || isNaN(col)) return;

  const piece = board[row][col];
  const isWhite = piece === piece.toUpperCase();

  if (selected) {
    // Check if clicked square is a valid move
    const validMove = validMoves.find(m => m.to.row === row && m.to.col === col);
    if (validMove) {
      const result = makeMove(board, validMove, gameState);
      board = result.board;
      gameState = result.gameState;
      selected = null;
      validMoves = [];
      renderBoard();
      return;
    }
    // Clicked elsewhere, reset selection
    selected = null;
    validMoves = [];
    renderBoard();
  } else if (piece !== '.' && isWhite === gameState.whiteToMove) {
    selected = { row, col };
    validMoves = generateMoves(board, piece, selected, gameState);
    renderBoard();
  }
}

boardContainer.addEventListener('click', handleSquareClick);
renderBoard();

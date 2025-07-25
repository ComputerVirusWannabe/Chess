# ChessAI
A chess engine complete with a board to play.
For now, no UI yet, just working on engine.

- Transposition table added to reduce computation for reaching same board with different move order.

- Minimax Horizon effect can occur, don't know when.
 WIll use quiescence search to fix this.
Quiescence search extends minimax search past the depth limit only for unstable positions (e.g., when there are pending captures or checks).

This prevents evaluating a position right before a big material swing — which can mislead minimax ("horizon effect").

- Principle variation search, PVS, (worth looking into) to optimixe minimax. Assumes that the first move is the best and searches it with full window, while searching others with a narrower (zero-width) window to prove they’re worse.
PVS is very effective when move ordering is good (move ordering coded already).


Once the rest of engine is solid:

- Use Zobrist hashing instead of string-based hashBoard (much faster).

- Store not just score, but also best move and node type (exact, upper bound, lower bound) in the transposition table.

- Track PV lines (principal variation) to display predicted best lines.

- Add iterative deepening for real-time best-move output and time controls.







generate.js move logic:
- queen move = union of bishop and rook moves (this save time so we don't have to re-generate for queen moves).
export function getPieceImage(piece) {
    if (!piece) return null;
    const typeMap = {
      pawn: 'p',
      rook: 'r',
      knight: 'n',
      bishop: 'b',
      queen: 'q',
      king: 'k',
    };
    const colorPrefix = piece.color[0]; // 'w' or 'b'
    const typeSuffix = typeMap[piece.type];
    return `/images/${colorPrefix}${typeSuffix}.png`;
  }
  
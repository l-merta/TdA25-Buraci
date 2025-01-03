const players = ["X", "O"]; // This can be extended in the future

const getPlaying = (board) => {
  const counts = Array(players.length).fill(0); // Initialize counts array based on players length

  for (let row of board) {
    for (let cell of row) {
      const playerIndex = players.indexOf(cell);
      if (playerIndex !== -1) {
        counts[playerIndex]++;
      }
    }
  }

  // Determine which character should play next
  const nextPlayerIndex = counts.indexOf(Math.min(...counts));
  return nextPlayerIndex;
};

const playField = (row, col, board, player) => { // Function to update game fields, row and col = field position, player = player index in the players list
  const newFields = board.map((r) => [...r]);
  newFields[row][col] = players[player];
  return newFields;
}

// Helper function to determine game state
const determineGameState = (board) => {
  const moves = board.flat().filter(cell => cell !== '').length;
  const rounds = Math.floor(moves / 2);

  if (checkPotentialWin(board, 4, players)) return 'endgame';
  if (rounds <= 5) return 'opening';
  if (rounds >= 6) return 'midgame';
  return 'unknown';
};

// Helper function to validate the game board
const validateBoard = (board) => {
  if (board.length !== 15 || board.some(row => row.length !== 15)) {
    return false;
  }
  const validSymbols = ['X', 'O', ''];
  const flatBoard = board.flat();
  if (!flatBoard.every(cell => validSymbols.includes(cell))) {
    return false;
  }
  const xCount = flatBoard.filter(cell => cell === 'X').length;
  const oCount = flatBoard.filter(cell => cell === 'O').length;
  if (xCount !== oCount && xCount !== oCount + 1) {
    return false;
  }
  return true;
};

const checkWin = (board, winLength, players) => {
  const numRows = board.length;
  const numCols = board[0].length;

  const checkDirection = (row, col, rowDir, colDir) => {
    const player = board[row][col];
    if (!players.includes(player)) return null;

    const coordinates = [{ row, col }];

    for (let i = 1; i < winLength; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      if (
        newRow < 0 || newRow >= numRows ||
        newCol < 0 || newCol >= numCols ||
        board[newRow][newCol] !== player
      ) {
        return null;
      }
      coordinates.push({ row: newRow, col: newCol });
    }
    return { player, coordinates };
  };

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const directions = [
        checkDirection(row, col, 0, 1),  // Horizontal
        checkDirection(row, col, 1, 0),  // Vertical
        checkDirection(row, col, 1, 1),  // Diagonal down-right
        checkDirection(row, col, 1, -1)  // Diagonal down-left
      ];

      for (const result of directions) {
        if (result) {
          return result;
        }
      }
    }
  }

  return null; // No winner
};

const checkPotentialWin = (board, winLength, players) => {
  const numRows = board.length;
  const numCols = board[0].length;

  const checkDirection = (row, col, rowDir, colDir) => {
    const player = board[row][col];
    if (!players.includes(player)) return null;

    const coordinates = [{ row, col }];

    for (let i = 1; i < winLength; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      if (
        newRow < 0 || newRow >= numRows ||
        newCol < 0 || newCol >= numCols ||
        board[newRow][newCol] !== player
      ) {
        return null;
      }
      coordinates.push({ row: newRow, col: newCol });
    }

    // Check if the next move can complete the win
    const nextRow = row + winLength * rowDir;
    const nextCol = col + winLength * colDir;
    const prevRow = row - rowDir;
    const prevCol = col - colDir;

    if (
      (nextRow >= 0 && nextRow < numRows && nextCol >= 0 && nextCol < numCols && board[nextRow][nextCol] === '') ||
      (prevRow >= 0 && prevRow < numRows && prevCol >= 0 && prevCol < numCols && board[prevRow][prevCol] === '')
    ) {
      return { player, coordinates };
    }

    return null;
  };

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const directions = [
        checkDirection(row, col, 0, 1),  // Horizontal
        checkDirection(row, col, 1, 0),  // Vertical
        checkDirection(row, col, 1, 1),  // Diagonal down-right
        checkDirection(row, col, 1, -1)  // Diagonal down-left
      ];

      for (const result of directions) {
        if (result) {
          return result;
        }
      }
    }
  }

  return null; // No potential win
};

module.exports = { players, getPlaying, playField, determineGameState, validateBoard, checkWin, checkPotentialWin };
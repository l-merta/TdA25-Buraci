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
  const rounds = Math.ceil(moves / 2);

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

  const checkDirection = (row, col, rowDir, colDir, player) => {
    if (board[row][col] !== player) return null;

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

    const nextCellEmpty = nextRow >= 0 && nextRow < numRows && nextCol >= 0 && nextCol < numCols && board[nextRow][nextCol] === '';
    const prevCellEmpty = prevRow >= 0 && prevRow < numRows && prevCol >= 0 && prevCol < numCols && board[prevRow][prevCol] === '';

    if (nextCellEmpty || prevCellEmpty) {
      // Check if the potential win is blockable
      const nextCellBlocked = nextRow >= 0 && nextRow < numRows && nextCol >= 0 && nextCol < numCols && board[nextRow][nextCol] !== '' && board[nextRow][nextCol] !== player;
      const prevCellBlocked = prevRow >= 0 && prevRow < numRows && prevCol >= 0 && prevCol < numCols && board[prevRow][prevCol] !== '' && board[prevRow][prevCol] !== player;

      if (nextCellBlocked && prevCellBlocked) {
        //console.log("returning null protože blocked obě strany");
        return null; // Blocked on both sides
      }

      // Check if the next player is the same as the player with the potential win
      const moves = board.flat().filter(cell => cell !== '').length;
      const nextPlayer = players[moves % players.length];
      if (nextPlayer !== player) {
        //console.log("returning null protože další hráč to blokne");
        return null; // The next player will block the potential win
      }

      //console.log("returning win pro " + player);
      return { player, coordinates };
    }

    return null;
  };

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      for (const player of players) {
        const directions = [
          checkDirection(row, col, 0, 1, player),  // Horizontal
          checkDirection(row, col, 1, 0, player),  // Vertical
          checkDirection(row, col, 1, 1, player),  // Diagonal down-right
          checkDirection(row, col, 1, -1, player)  // Diagonal down-left
        ];

        for (const result of directions) {
          if (result) {
            return result;
          }
        }
      }
    }
  }

  return null; // No potential win
};

const playFieldAi = (board, aiPlayerIndex) => {
  const findRandomMove = (board) => {
    const emptyCells = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === '') {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  // Make a random move
  const move = findRandomMove(board);
  if (move) {
    return playField(move.row, move.col, board, aiPlayerIndex);
  }

  return board; // No move possible
};

module.exports = { players, getPlaying, playField, determineGameState, validateBoard, checkWin, checkPotentialWin, playFieldAi };
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

const playField = (row, col, board, player) => {
  console.log(row, col, player);
  const newFields = board.map((r) => [...r]);
  newFields[row][col] = players[player];
  return newFields;
}

// Helper function to determine game state
const determineGameState = (board) => {
  const moves = board.flat().filter(cell => cell !== '').length;
  const rounds = Math.ceil(moves / 2);

  if (checkPotentialWin(board, 5, players)) return 'endgame';
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
  const results = [];

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
          results.push(result);
        }
      }
    }
  }

  return results.length > 0 ? results : null; // Return all possible wins or null if none found
};

// Helper function to get available spots before and after the sequence
function getAvailableSpots(sequence, board, numRows, numCols) {
  const potentialCoordinates = [];
  const rowDir = sequence[1].row - sequence[0].row;
  const colDir = sequence[1].col - sequence[0].col;

  // Check the cell before the sequence
  const beforeRow = sequence[0].row - rowDir;
  const beforeCol = sequence[0].col - colDir;
  if (beforeRow >= 0 && beforeRow < numRows && beforeCol >= 0 && beforeCol < numCols && board[beforeRow][beforeCol] === '') {
    potentialCoordinates.push({ row: beforeRow, col: beforeCol });
  }

  // Check the cell after the sequence
  const afterRow = sequence[sequence.length - 1].row + rowDir;
  const afterCol = sequence[sequence.length - 1].col + colDir;
  if (afterRow >= 0 && afterRow < numRows && afterCol >= 0 && afterCol < numCols && board[afterRow][afterCol] === '') {
    potentialCoordinates.push({ row: afterRow, col: afterCol });
  }

  return potentialCoordinates;
}

const checkPotentialWin = (board, winLength, players, forPlayer = null, emptySpots = 1) => {
  const numRows = board.length;
  const numCols = board[0].length;
  let results = [];

  if (!forPlayer) {
    forPlayer = players[getPlaying(board)];
  }

  const checkDirection = (row, col, rowDir, colDir, player) => {
    const sequence = [];
    const coordinates = [];
    let gapIndex = -1;

    for (let i = 0; i < winLength; i++) {
      const newRow = row + i * rowDir;
      const newCol = col + i * colDir;
      if (
        newRow < 0 || newRow >= numRows ||
        newCol < 0 || newCol >= numCols
      ) {
        break;
      }
      sequence.push(board[newRow][newCol]);
      coordinates.push({ row: newRow, col: newCol });
      if (board[newRow][newCol] === '' && gapIndex === -1) {
        gapIndex = i;
      }
    }

    const result = checkSequence(sequence, emptySpots);
    if (result && result.seq === player) {
      const potentialCoordinates = [];

      // If there's a gap, return only the gap coordinate
      if (gapIndex !== -1 && gapIndex !== 0 && gapIndex !== winLength - 1) {
        console.log("returning gap");
        const gapRow = row + gapIndex * rowDir;
        const gapCol = col + gapIndex * colDir;
        return { player, coordinates: { row: gapRow, col: gapCol } };
      }

      /*
      // Check the cell before the sequence
      const beforeRow = row - rowDir;
      const beforeCol = col - colDir;
      if (beforeRow >= 0 && beforeRow < numRows && beforeCol >= 0 && beforeCol < numCols && board[beforeRow][beforeCol] === '') {
        potentialCoordinates.push({ row: beforeRow, col: beforeCol });
      }

      // Check the cell after the sequence
      let afterRow = row + (winLength - 1) * rowDir + rowDir;
      let afterCol = col + (winLength - 1) * colDir + colDir;
      if (rowDir == 1)
        afterRow--;
      if (colDir == 1)
        afterCol--;
      if (afterRow >= 0 && afterRow < numRows && afterCol >= 0 && afterCol < numCols && board[afterRow][afterCol] === '') {
        potentialCoordinates.push({ row: afterRow, col: afterCol });
      }

      return { player, coordinates: potentialCoordinates };
      */
    }

    return null;
  };

  const checkSequence = (sequence, emptySpots) => {
    let count = 1;
    let emptyCount = 0;
    let curChar = sequence[0];

    if (winLength === 1) return { seq: curChar, winArr: sequence };

    for (let i = 1; i < sequence.length; i++) {
      if (sequence[i] === curChar) {
        count++;
        if (count >= winLength && curChar !== '') return { seq: curChar, winArr: sequence };
      } else if (sequence[i] === '' && emptyCount < emptySpots) {
        emptyCount++;
        count++;
        if (count >= winLength && curChar !== '') return { seq: curChar, winArr: sequence };
      } else {
        count = 1;
        emptyCount = 0;
        curChar = sequence[i];
      }
    }
    return null;
  };

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      for (const player of players) {
        if (forPlayer && player !== forPlayer) continue;

        const directions = [
          checkDirection(row, col, 0, 1, player),  // Horizontal
          checkDirection(row, col, 1, 0, player),  // Vertical
          checkDirection(row, col, 1, 1, player),  // Diagonal down-right
          checkDirection(row, col, 1, -1, player)  // Diagonal down-left
        ];

        for (const result of directions) {
          if (result) {
            results.push(result);
          }
        }
      }
    }
  }

  const possibleWin = checkWin(board, winLength - 1, players);
  const avaSpots = [];
  if (possibleWin) {
    console.log("poss win: ", possibleWin);
    possibleWin.forEach((win) => {
      const as = getAvailableSpots(win.coordinates, board, numRows, numCols);
      if (as) {
        avaSpots.push({
          player: win.player,
          coordinates: as
        });
      }
    });
    console.log("avaSpots: ", avaSpots);
  }
  if (avaSpots.length > 0) {
    avaSpots.forEach((spot) => {
      if (spot.player === forPlayer)
        spot.coordinates.forEach((coor) => {
            results.push({ coordinates: coor });
        });
    });
  }

  console.log("returning results: ", results);
  return results.length > 0 ? results : null; // Return potential wins or null if none found
};

const playFieldAi = (board, aiPlayerIndex) => {
  const opp = aiPlayerIndex === 0 ? 1 : 0;

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

  // Make a potential win move
  const ai_pot_move = checkPotentialWin(board, 5, players, players[aiPlayerIndex]);
  if (ai_pot_move) {
    console.log("AI playing winning move");
    const coords = [];
    ai_pot_move.forEach((move) => {
      coords.push(move.coordinates);
    });
    if (coords.length > 0) {
      const coord = coords[Math.floor(Math.random() * coords.length)];
      return playField(coord.row, coord.col, board, aiPlayerIndex);
    }
  }

  // Make a potential win move
  const opp_pot_move = checkPotentialWin(board, 5, players, players[opp]);
  if (opp_pot_move) {
    console.log("AI defending opps winning move");
    const coords = [];
    opp_pot_move.forEach((move) => {
      coords.push(move.coordinates);
    });
    if (coords.length > 0) {
      console.log("coords: ", coords);
      const coord = coords[Math.floor(Math.random() * coords.length)];
      return playField(coord.row, coord.col, board, aiPlayerIndex);
    }
  }

  // Make a potential win -2 move
  const opp_pot_move2 = checkPotentialWin(board, 4, players, players[opp]);
  if (opp_pot_move2) {
    console.log("AI defending opps almost winning move");
    const coords = [];
    opp_pot_move2.forEach((move) => {
      coords.push(move.coordinates);
    });
    if (coords.length > 0) {
      const coord = coords[Math.floor(Math.random() * coords.length)];
      return playField(coord.row, coord.col, board, aiPlayerIndex);
    }
  }

  // Make a random move
  const rand_move = findRandomMove(board);
  if (rand_move) {
    console.log("AI playing random");
    return playField(rand_move.row, rand_move.col, board, aiPlayerIndex);
  }

  return board; // No move possible
};

module.exports = { players, getPlaying, playField, determineGameState, validateBoard, checkWin, checkPotentialWin, playFieldAi };
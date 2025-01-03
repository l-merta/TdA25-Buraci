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
  if (moves <= 5) return 'opening';
  if (moves >= 6) return 'midgame';
  // Add logic to check for endgame conditions
  // ...
  return 'unknown';
};

// Helper function to validate the game board
const validateBoard = (board) => {
  if (board.length !== 15 || board.some(row => row.length !== 15)) {
    return false;
  }
  const validSymbols = ['X', 'O', ''];
  return board.flat().every(cell => validSymbols.includes(cell));
};

module.exports = { getPlaying, playField, determineGameState, validateBoard };
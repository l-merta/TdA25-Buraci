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

module.exports = { getPlaying, playField };
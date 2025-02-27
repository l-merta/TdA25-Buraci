const { getDb } = require("./db");
const jwt = require("jsonwebtoken");

const addEloToUser = async (token) => {
  let uuid;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    uuid = decoded.uuid;
  } catch (err) {
    console.error("Invalid token");
    return;
  }

  const db = await getDb();
  const user = await db.get(`SELECT elo, wins, draws, losses FROM users WHERE uuid = ?`, [uuid]);
  if (user) {
    const newElo = calculateElo(user.elo, user.wins, user.draws, user.losses);
    await db.run(`UPDATE users SET elo = ? WHERE uuid = ?`, [newElo, uuid]);
    console.log(`Updated ELO for user ${uuid} to ${newElo}`);
  } else {
    console.error(`User with UUID ${uuid} not found`);
  }
}

function calculateElo(currentElo, wins, draws, losses) {
  const K = 40;
  const alpha = 0.5;
  const scalingFactor = 400;

  const totalGames = wins + draws + losses;
  const winDrawRatio = (wins + draws) / totalGames;

  const expectedScore = 1 / (1 + Math.pow(10, (currentElo - currentElo) / scalingFactor)); // Placeholder, replace with actual opponent's ELO
  const actualScore = 1; // Placeholder, replace with actual game result (1 for win, 0.5 for draw, 0 for loss)

  const adjustmentFactor = 1 + alpha * (0.5 - winDrawRatio);
  const newElo = currentElo + K * (actualScore - expectedScore) * adjustmentFactor;

  return Math.max(0, Math.round(newElo)); // Ensure ELO is not negative and round up
}

const addWinToUser = async (token) => {
  let uuid;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    uuid = decoded.uuid;
  } catch (err) {
    console.error("Invalid token");
    return;
  }

  const db = await getDb();
  const user = await db.get(`SELECT wins FROM users WHERE uuid = ?`, [uuid]);
  if (user) {
    const newWins = user.wins + 1;
    await db.run(`UPDATE users SET wins = ? WHERE uuid = ?`, [newWins, uuid]);
    console.log(`Updated wins for user ${uuid} to ${newWins}`);
  } else {
    console.error(`User with UUID ${uuid} not found`);
  }
}

const addLossToUser = async (token) => {
  let uuid;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    uuid = decoded.uuid;
  } catch (err) {
    console.error("Invalid token");
    return;
  }

  const db = await getDb();
  const user = await db.get(`SELECT losses FROM users WHERE uuid = ?`, [uuid]);
  if (user) {
    const newLosses = user.losses + 1;
    await db.run(`UPDATE users SET losses = ? WHERE uuid = ?`, [newLosses, uuid]);
    console.log(`Updated losses for user ${uuid} to ${newLosses}`);
  } else {
    console.error(`User with UUID ${uuid} not found`);
  }
}

const addDrawToUser = async (token) => {
  let uuid;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    uuid = decoded.uuid;
  } catch (err) {
    console.error("Invalid token");
    return;
  }

  const db = await getDb();
  const user = await db.get(`SELECT draws FROM users WHERE uuid = ?`, [uuid]);
  if (user) {
    const newDraws = user.draws + 1;
    await db.run(`UPDATE users SET draws = ? WHERE uuid = ?`, [newDraws, uuid]);
    console.log(`Updated draws for user ${uuid} to ${newDraws}`);
  } else {
    console.error(`User with UUID ${uuid} not found`);
  }
}

module.exports = { addEloToUser, addWinToUser, addLossToUser, addDrawToUser };
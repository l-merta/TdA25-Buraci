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
  const user = await db.get(`SELECT elo FROM users WHERE uuid = ?`, [uuid]);
  if (user) {
    const newElo = calculateElo(user.elo);
    await db.run(`UPDATE users SET elo = ? WHERE uuid = ?`, [newElo, uuid]);
    console.log(`Updated ELO for user ${uuid} to ${newElo}`);
  } else {
    console.error(`User with UUID ${uuid} not found`);
  }
}

function calculateElo(currentElo) {
  // Calculate new ELO based on current ELO
  // This is a placeholder implementation, replace with actual ELO calculation logic
  return currentElo + 100;
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
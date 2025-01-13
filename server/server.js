const express = require("express");
const cors = require("cors");
const { connectToDatabase, getDb, closeDatabase, refreshDatabaseConnection } = require("./db");
const { players, getPlaying, playField, determineGameState, validateBoard, checkWin, playFieldAi, checkPotentialWin } = require("./gameplay");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5200;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.static("public")); // Slouží statické soubory z Reactu

// Database connection
connectToDatabase();

// Refresh database connection every 30 minutes
setInterval(refreshDatabaseConnection, 0.5 * 60 * 60 * 1000);

// API Endpoints
app.post("/api/v1/games", async (req, res) => {
  const { name, difficulty, board } = req.body;

  if (!name || !difficulty || !board) {
    return res.status(400).json({ code: 400, message: "Bad request: Missing required fields" });
  }

  if (!validateBoard(board)) {
    return res.status(422).json({ code: 422, message: "Semantic error: Invalid board state" });
  }

  const gameState = determineGameState(board);

  const game = {
    uuid: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name,
    difficulty,
    gameState,
    board,
  };

  try {
    const db = getDb();
    await db.run(
      `INSERT INTO games (uuid, createdAt, updatedAt, name, difficulty, gameState, board) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        game.uuid,
        game.createdAt,
        game.updatedAt,
        game.name,
        game.difficulty,
        game.gameState,
        JSON.stringify(game.board),
      ]
    );
    res.status(201).json(game);
  } catch (error) {
    console.error("Error inserting game into database:", error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.get("/api/v1/games", async (req, res) => {
  try {
    const db = getDb();
    const rows = await db.all(`SELECT * FROM games`);
    rows.forEach(row => {
      row.board = JSON.parse(row.board); // Convert board back to JSON
    });
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.get("/api/v1/games/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const db = getDb();
    const row = await db.get(`SELECT * FROM games WHERE uuid = ?`, [uuid]);
    if (!row) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }
    row.board = JSON.parse(row.board);
    res.json({ ...row, playing: getPlaying(row.board) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.put("/api/v1/games/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const { name, difficulty, board } = req.body;

  if (!name || !difficulty || !board) {
    return res.status(400).json({ code: 400, message: "Bad request: Missing required fields" });
  }

  if (!validateBoard(board)) {
    return res.status(422).json({ code: 422, message: "Semantic error: Invalid board state" });
  }

  const gameState = determineGameState(board);

  const updatedGame = {
    name,
    difficulty,
    gameState,
    board,
    updatedAt: new Date().toISOString(),
  };

  try {
    //await connectToDatabase();
    const db = getDb();
    const result = await db.run(
      `UPDATE games SET name = ?, difficulty = ?, gameState = ?, board = ?, updatedAt = ? WHERE uuid = ?`,
      [updatedGame.name, updatedGame.difficulty, updatedGame.gameState, JSON.stringify(updatedGame.board), updatedGame.updatedAt, uuid]
    );
    if (result.affectedRows === 0) {
      //await closeDatabase();
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }

    const updatedRow = await db.get(`SELECT * FROM games WHERE uuid = ?`, [uuid]);
    if (!updatedRow) {
      //await closeDatabase();
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }
    updatedRow.board = JSON.parse(updatedRow.board);
    //await closeDatabase();
    res.status(200).json(updatedRow);
  } catch (error) {
    //await closeDatabase();
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
});

app.delete("/api/v1/games/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    //await connectToDatabase();
    const db = getDb();
    const result = await db.run(`DELETE FROM games WHERE uuid = ?`, [uuid]);
    if (result.affectedRows === 0) {
      //await closeDatabase();
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }
    //await closeDatabase();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    //await closeDatabase();
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
});

// Endpoint for handling game field clicks
app.put("/api/v1/gameFieldClick", async (req, res) => {
  const { row, col, board, ai } = req.body;
  const newGameData = { 
    ...req.body, 
    //board: playField(row, col, board, getPlaying(board)), 
    playing: getPlaying(board),
    win: null
  }

  newGameData.nextPlaying = newGameData.playing == players.length - 1 ? 0 : newGameData.playing + 1;

  //console.log("Someone is playing - " + players[getPlaying(board)] + " - " + ai[getPlaying(board)]);
  if (ai[getPlaying(board)] == 1) {
    //console.log("AI is playing");
    newGameData.board = playFieldAi(board, getPlaying(board))
  }
  else {
    newGameData.board = playField(row, col, board, getPlaying(board));
  }

  checkPotentialWin(newGameData.board, 5, players);
  const win = checkWin(newGameData.board, 5, players);
  if (win)
    newGameData.win = win[0];
  else 
    newGameData.win = null;

  try {
    res.json(newGameData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    res.redirect(`/error?message=${encodeURIComponent(err.message || "An error occurred")}`);
  } else {
    res.status(500).json({ code: 500, message: err.message || "Internal Server Error" });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    console.log("Received SIGINT. Closing database connection...");
    await closeDatabase();
    console.log("Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err.message);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  try {
    console.log("Received SIGTERM. Closing database connection...");
    await closeDatabase();
    console.log("Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err.message);
    process.exit(1);
  }
});

// Obsluhuje všechny ostatní cesty a vrací hlavní HTML soubor
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
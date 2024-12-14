const express = require("express");
const cors = require("cors");
const { connectToDatabase, getDb, closeDatabase } = require("./db");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5200;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.static("public")); // Slouží statické soubory z Reactu

// Database connection
//connectToDatabase();
console.log(process.env.DB_HOST);

// API Endpoints
app.post("/api/v1/games", async (req, res) => {
  const { name, difficulty, board } = req.body;

  if (!name || !difficulty || !board) {
    return res.status(400).json({ code: 400, message: "Bad request: Missing required fields" });
  }

  const game = {
    uuid: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name,
    difficulty,
    gameState: "unknown",
    board,
  };

  try {
    const db = require("./db").getDb();
    await db.run(
      `INSERT INTO games (uuid, createdAt, updatedAt, name, difficulty, gameState, board) VALUES (?, ?, ?, ?, ?, ?, ?)`
    , [
      game.uuid,
      game.createdAt,
      game.updatedAt,
      game.name,
      game.difficulty,
      game.gameState,
      JSON.stringify(game.board),
    ]);
    res.status(201).json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.get("/api/v1/games", async (req, res) => {
  try {
    const db = require("./db").getDb();
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
    const db = require("./db").getDb();
    const row = await db.get(`SELECT * FROM games WHERE uuid = ?`, [uuid]);
    if (!row) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }
    row.board = JSON.parse(row.board);
    res.json(row);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.put("/api/v1/games/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const { name, difficulty, board } = req.body;

  try {
    const db = require("./db").getDb();
    const existing = await db.get(`SELECT * FROM games WHERE uuid = ?`, [uuid]);
    if (!existing) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }

    const updatedAt = new Date().toISOString();
    await db.run(
      `UPDATE games SET name = ?, difficulty = ?, board = ?, updatedAt = ? WHERE uuid = ?`,
      [name, difficulty, JSON.stringify(board), updatedAt, uuid]
    );

    res.json({ ...existing, name, difficulty, board, updatedAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.delete("/api/v1/games/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const db = require("./db").getDb();
    const existing = await db.get(`SELECT * FROM games WHERE uuid = ?`, [uuid]);
    if (!existing) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }

    await db.run(`DELETE FROM games WHERE uuid = ?`, [uuid]);
    res.status(204).send();
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

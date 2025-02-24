const express = require("express");
const cors = require("cors");
const { connectToDatabase, getDb, closeDatabase, refreshDatabaseConnection } = require("./db");
const { players, getPlaying, playField, determineGameState, validateBoard, checkWin, playFieldAi, checkPotentialWin } = require("./gameplay");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const http = require("http");
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

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

// Create HTTP server
const server = http.createServer(app);

// Import and use WebSocket server
require("./online")(server);

// API Endpoints for Users
app.post("/api/v1/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ code: 400, message: "Bad request: Missing required fields" });
  }

  try {
    const db = await getDb();
    const existingUsername = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
    if (existingUsername) {
      return res.status(409).json({ code: 409, message: "Conflict: Username already exists" });
    }

    const existingEmail = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (existingEmail) {
      return res.status(409).json({ code: 409, message: "Conflict: Email already exists" });
    }

    const hashedPassword = await argon2.hash(password, 10); // Hash the password

    const user = {
      uuid: uuidv4(),
      createdAt: new Date().toISOString(),
      username,
      email,
      password: hashedPassword, // Store the hashed password
      elo: 400,
      wins: 0,
      draws: 0,
      losses: 0,
    };

    await db.run(
      `INSERT INTO users (uuid, createdAt, username, email, password, elo, wins, draws, losses) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.uuid,
        user.createdAt,
        user.username,
        user.email,
        user.password,
        user.elo,
        user.wins,
        user.draws,
        user.losses,
      ]
    );
    const { password: hashedPwd, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error inserting user into database:", error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.get("/api/v1/getUserByToken", authenticateToken, async (req, res) => {
  console.log(req.user);
  try {
    const db = await getDb();
    const user = await db.get(`
      SELECT u.uuid, u.username, u.email, u.role, u.elo, u.wins, u.draws, u.losses, pc.color 
      FROM users u
      LEFT JOIN profile_colors pc ON u.color = pc.id
      WHERE u.uuid = ?
    `, [req.user.uuid]);
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.get("/api/v1/users", async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(`
      SELECT u.*, pc.color 
      FROM users u
      LEFT JOIN profile_colors pc ON u.color = pc.id
      ORDER BY u.elo DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.get("/api/v1/users/uuid/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const db = await getDb();
    const row = await db.get(`
      SELECT u.*, pc.color 
      FROM users u
      LEFT JOIN profile_colors pc ON u.color = pc.id
      WHERE u.uuid = ?
    `, [uuid]);
    if (!row) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }
    res.json(row);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.get("/api/v1/users/username/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const db = await getDb();
    const row = await db.get(`
      SELECT u.*, pc.color 
      FROM users u
      LEFT JOIN profile_colors pc ON u.color = pc.id
      WHERE u.username = ?
    `, [username]);
    if (!row) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }
    res.json(row);
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

app.put("/api/v1/users/:uuid", async (req, res) => {
  const { uuid } = req.params;
  const { username, email, password, elo } = req.body;

  if (!username || !email || !password || elo === undefined) {
    return res.status(400).json({ code: 400, message: "Bad request: Missing required fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const updatedUser = {
    username,
    email,
    password: hashedPassword, // Store the hashed password
    elo,
    updatedAt: new Date().toISOString(),
  };


  try {
    const db = await getDb();
    const result = await db.run(
      `UPDATE users SET username = ?, email = ?, password = ?, elo = ?, updatedAt = ? WHERE uuid = ?`,
      [updatedUser.username, updatedUser.email, updatedUser.password, updatedUser.elo, updatedUser.updatedAt, uuid]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }

    const updatedRow = await db.get(`SELECT * FROM users WHERE uuid = ?`, [uuid]);
    if (!updatedRow) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }
    res.status(200).json(updatedRow);
  } catch (error) {
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
});

app.delete("/api/v1/users/:uuid", async (req, res) => {
  const { uuid } = req.params;

  try {
    const db = await getDb();
    const result = await db.run(`DELETE FROM users WHERE uuid = ?`, [uuid]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ code: 404, message: "Resource not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
});

app.post("/api/v1/users/:uuid/ban", async (req, res) => {
  const { uuid } = req.params; // Získání UUID uživatele z URL

  // Ověření, zda je přihlášený uživatel admin
  /*
  console.log(req.user);
  if (req.user.role !== "admin") {
    return res.status(403).json({ code: 403, message: "Forbidden: Only admin can perform this action" });
  }
  */

  try {
    const db = await getDb();

    // Najdi uživatele podle UUID
    const user = await db.get("SELECT id FROM users WHERE uuid = ?", [uuid]);

    // Pokud uživatel neexistuje, vrátíme chybu 404
    if (!user) {
      return res.status(404).json({ code: 404, message: "User not found" });
    }

    const userId = user.id; // Získání ID uživatele

    // Vložení záznamu do tabulky blacklist
    await db.run(
      "INSERT INTO blacklist (userId) VALUES (?)", [userId]
    );

    // Odešleme odpověď s úspěšným statusem
    res.status(201).json({ code: 201, message: "User has been banned successfully" });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

// API Endpoint for Login
app.post("/api/v1/login", async (req, res) => {
  const { nameOrEmail, password } = req.body;

  if (!nameOrEmail || !password) {
    return res.status(400).json({ code: 400, message: "Bad request: Missing required fields" });
  }

  try {
    const db = await getDb();
    const user = await db.get(`
      SELECT u.*, pc.color 
      FROM users u
      LEFT JOIN profile_colors pc ON u.color = pc.id
      WHERE u.username = ? OR u.email = ?
    `, [nameOrEmail, nameOrEmail]);

    if (!user) {
      return res.status(401).json({ code: 401, message: "Unauthorized: Invalid username/email or password" });
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ code: 401, message: "Unauthorized: Invalid username/email or password" });
    }

    const token = jwt.sign({ uuid: user.uuid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { password: userPassword, ...userWithoutPassword } = user;
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ code: 500, message: "Internal Server Error" });
  }
});

// API Endpoints for Games
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
    const db = await getDb();
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
  const { name, difficulty, lastModified } = req.query;
  let query = `SELECT * FROM games WHERE 1=1`;
  const params = [];

  if (name) {
    query += ` AND name LIKE ?`;
    params.push(`%${name}%`);
  }

  if (difficulty) {
    query += ` AND difficulty = ?`;
    params.push(difficulty);
  }

  if (lastModified) {
    query += ` AND updatedAt >= ?`;
    params.push(new Date(lastModified).toISOString());
  }

  query += ` ORDER BY updatedAt DESC`;

  try {
    const db = await getDb();
    const rows = await db.all(query, params);
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
    const db = await getDb();
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
    const db = await getDb();
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
    const db = await getDb();
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

// Middleware to validate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ code: 401, message: "Unauthorized: No token provided" });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ code: 403, message: "Forbidden: Invalid token" });
    req.user = user;
    next();
  });
}

function authenticateTokenAdmin(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ code: 401, message: "Unauthorized: No token provided" });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ code: 403, message: "Forbidden: Invalid token" });

    try {
      const db = await getDb();
      const adminUser = await db.get(`SELECT role FROM users WHERE uuid = ?`, [user.uuid]);
      if (adminUser.role !== 'admin') {
        return res.status(403).json({ code: 403, message: "Forbidden: Only admin can perform this action" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Error verifying admin role:", error);
      res.status(500).json({ code: 500, message: "Internal Server Error" });
    }
  });
}

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

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
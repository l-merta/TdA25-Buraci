const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');

// In-memory storage for game sessions
const gameSessions = new Map();

// Placeholder function to fetch a game preset from the database
async function getGamePreset(uuid) {
  // This is a placeholder function, replace with actual DB query
  // Example preset data
  return {
    uuid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Preset Game",
    difficulty: "Medium",
    gameState: "Not Started",
    board: Array.from({ length: 15 }, () => Array(15).fill(''))
  };
}

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Handle creating a new game session
    socket.on("createGameSession", async (callback) => {
      const newSession = {
        id: uuidv4(),
        gameData: {
          uuid: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          name: "Default Game",
          difficulty: "Easy",
          gameState: "Not Started",
          board: Array.from({ length: 15 }, () => Array(15).fill(''))
        }
      };
      gameSessions.set(newSession.id, newSession);
      callback(newSession);
    });

    // Handle joining a game session with or without a preset uuid
    socket.on("joinGameSession", async (sessionId, callback) => {
      let session = gameSessions.get(sessionId);
      if (!session) {
        const gamePreset = await getGamePreset(sessionId);
        session = {
          id: sessionId,
          gameData: gamePreset
        };
        gameSessions.set(sessionId, session);
      }

      io.to(sessionId).emit("message", "dobrej");
      if (session) {
        socket.join(sessionId);
        callback(session);
      } else {
        callback(null);
      }
    });

    // Handle making a move
    socket.on("makeMove", async ({ sessionId, coordinates }) => {
      const session = gameSessions.get(sessionId);
      if (session) {
        const { x, y } = coordinates;
        const gameData = session.gameData;

        // Calculate the new game state
        if (gameData.board[x][y] === '') {
          gameData.board[x][y] = "X"; // Example: Set the clicked cell to "X"
        }

        // Update the game session in memory
        gameData.updatedAt = new Date().toISOString();
        gameSessions.set(sessionId, session);

        // Broadcast the updated game data to all clients in the session
        io.to(sessionId).emit("updateGameData", gameData);
        console.log(`Emitted updated game data to session ${sessionId}`);
      }
    });

    // Handle leaving a game session
    socket.on("leaveGameSession", (sessionId) => {
      gameSessions.delete(sessionId);
      socket.leave(sessionId);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};
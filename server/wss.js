const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');

// Placeholder functions for database operations
async function createNewGameSession() {
  // Create a new game session in the game_sessions table
  // This is a placeholder function, replace with actual DB query
  const newSession = { id: uuidv4(), gameData: 'new game data' };
  // Save newSession to the database
  return newSession;
}

async function getGameSession(sessionId) {
  // Fetch the game session from the game_sessions table using the sessionId
  // This is a placeholder function, replace with actual DB query
  return { id: sessionId, gameData: 'existing game data' };
}

async function deleteGameSession(sessionId) {
  // Delete the game session from the game_sessions table
  // This is a placeholder function, replace with actual DB query
  console.log(`Deleting game session with ID: ${sessionId}`);
  // Perform the deletion in the database
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
      const newSession = await createNewGameSession();
      callback(newSession);
    });

    // Handle joining a game session
    socket.on("joinGameSession", async (sessionId, callback) => {
      const session = await getGameSession(sessionId);
      if (session) {
        socket.join(sessionId);
        callback(session);
      } else {
        callback(null);
      }
    });

    // Handle leaving a game session
    socket.on("leaveGameSession", async (sessionId) => {
      await deleteGameSession(sessionId);
      socket.leave(sessionId);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
    });
  });
};
const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const rooms = {};

  io.on("connection", (socket) => {
    let { roomId } = socket.handshake.query;
    if (roomId === "undefined") roomId = null;

    console.log(`Client connected to room ${roomId}`);

    if (!roomId) {
      let newRoomId;
      do {
        newRoomId = Math.floor(10000 + Math.random() * 90000).toString(); // Generate a 5-digit room code using only numbers
      } while (rooms[newRoomId]);

      rooms[newRoomId] = {
        gameStarted: false,
        players: []
      };

      socket.emit("redirect", { 
        type: "room",
        roomId: newRoomId
      });
    } else {
      // Error handling
      if (!rooms[roomId]) {
        console.log("room does not exist");
        socket.emit("redirect", { 
          type: "error",
          error: "roomNotFound",
          message: "Místnost s tímto kódem neexistuje",
        });
        return;
      }
      if (rooms[roomId].length >= 2) {
        console.log("room is full");
        socket.emit("redirect", { 
          type: "error",
          error: "roomFull",
          message: "Místnost je plná",
        });
        return;
      }

      const playerName = `Hráč ${rooms[roomId].players.length + 1}`;
      const playerChar = rooms[roomId].players.length === 0 ? "X" : "O";
      const playerHost = rooms[roomId].players.length === 0;
      rooms[roomId].players.push({ socket, playerName, playerChar, playerHost });

      socket.emit("welcome", { 
        message: "Welcome to the room!", 
        //players: rooms[roomId].map(client => client.playerName) 
      });

      rooms[roomId].players.forEach(client => {
        client.socket.emit("updatePlayers", { 
          players: rooms[roomId].players.map(client => client.playerName)
        });
      });

      socket.on("switchChar", () => {
        // Switch player char
        rooms[roomId].players.forEach(client => {
          client.playerChar = client.playerChar === "X" ? "O" : "X";
        });

        // Emit updated player list
        rooms[roomId].players.forEach(client => {
          client.socket.emit("updatePlayers", { 
            players: rooms[roomId].players.map(client => client.playerName)
          });
        });
      });

      socket.on("message", (data) => {
        console.log(`Received message from room ${roomId}: ${data.message}`);
        socket.emit("reply", { message: "Server replying to " + data.message });
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected from room ${roomId}`);
        rooms[roomId].players = rooms[roomId].players.filter(client => client.socket !== socket);
        if (rooms[roomId].players.length === 0) {
          delete rooms[roomId];
        } else {
          rooms[roomId].players.forEach(client => {
            client.socket.emit("updatePlayers", { 
              players: rooms[roomId].players.map(client => client.playerName)
            });
          });
        }
      });
    }
  });
};
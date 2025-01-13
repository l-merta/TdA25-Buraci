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
    if (roomId == "undefined")
      roomId = null;
    
    console.log(`Client connected to room ${roomId}`);

    if (!roomId) {
      const newRoomId = Math.random().toString(36).substring(2, 7); // Generate a 5-digit room code
      socket.emit("redirect", { roomId: newRoomId });
    } 
    else {
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      rooms[roomId].push(socket);

      socket.emit("welcome", { message: "Welcome to the room!" });

      socket.on("message", (data) => {
        console.log(`Received message from room ${roomId}: ${data.message}`);
      });

      socket.on("disconnect", () => {
        rooms[roomId] = rooms[roomId].filter(client => client !== socket);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      });
    }
  });
};
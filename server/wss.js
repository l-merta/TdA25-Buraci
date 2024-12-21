const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 5201;

// Create an HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store rooms and users
const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle room creation with unique 5-digit room ID
  socket.on("createRoom", (roomId, callback) => {
    if (rooms.has(roomId)) {
      callback(false); // Room ID is taken
    } else {
      rooms.set(roomId, []);
      callback(true); // Room ID is available
    }
  });

  // Handle joining a room
  socket.on("joinRoom", (roomId) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit("error", { code: 101, message: "Místnost s tímto kódem neexistuje" }); // Send error to the client
      return;
    }

    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    room.push({ id: socket.id });
    io.to(roomId).emit("message", { message: "nazdar" });
  });

  // Handle sending a message in the room
  socket.on("sendMessage", ({ roomId, message }) => {
    if (rooms.has(roomId)) {
      const user = rooms.get(roomId).find((u) => u.id === socket.id);
      if (user) {
        io.to(roomId).emit("receiveMessage", {
          sender: user.name,
          message,
        });
      }
    }
  });

  // Handle leaving the room
  socket.on("leaveRoom", (roomId) => {
    const users = rooms.get(roomId);
    if (!users) return;

    console.log("Deleting room " + roomId);

    socket.leave(roomId);
    rooms.delete(roomId);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);

    // Remove the user from any rooms they were part of
    rooms.forEach((users, roomId) => {
      const updatedUsers = users.filter((user) => user.id !== socket.id);
      rooms.set(roomId, updatedUsers);

      // If the room is now empty, remove it from the list
      if (updatedUsers.length === 0) {
        console.log("Deleting room " + roomId);
        rooms.delete(roomId);
      } else {
        io.to(roomId).emit("roomUsers", updatedUsers);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
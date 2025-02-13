const { Server } = require("socket.io");
const { players, getPlaying, playField, checkWin, checkPotentialWin } = require("./gameplay");

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
    if (roomId === "undefined" || roomId === 'null') roomId = null;

    console.log(`Client connected to room ${roomId}`);

    if (!roomId) {
      let newRoomId;
      do {
        newRoomId = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 5-digit room code using only numbers
      } while (rooms[newRoomId]);

      rooms[newRoomId] = {
        gameStarted: false,
        uuid: "",
        players: []
      };

      socket.emit("redirect", { 
        type: "room",
        roomId: newRoomId
      });
    } else {
      if (!rooms[roomId]) {
        console.log("room does not exist");
        socket.emit("redirect", { 
          type: "error",
          error: "roomNotFound",
          message: "Místnost s tímto kódem neexistuje",
        });
        return;
      }

      if (rooms[roomId].players.length >= 2) {
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
        message: "WebSocket connection established - love, server", 
        players: rooms[roomId].players.map(client => client.playerName) 
      });

      emitPlayerList(rooms[roomId]);

      socket.on("message", (data) => {
        console.log(`Received message from room ${roomId}: ${data.message}`);
        socket.emit("reply", { message: "Server replying to " + data.message });
      });

      socket.on("switchChar", () => {
        // Switch player char
        rooms[roomId].players.forEach(client => {
          client.playerChar = client.playerChar === "X" ? "O" : "X";
        });

        // Ensure player with playerChar "X" is at index 0 and player with playerChar "O" is at index 1
        rooms[roomId].players.sort((a, b) => (a.playerChar === "X" ? -1 : 1));

        // Emit updated player list
        emitPlayerList(rooms[roomId]);
      });

      socket.on("startGame", () => {
        // Set started to true
        rooms[roomId].gameStarted = true;

        // Emit updated room data
        emitRoomData(rooms[roomId]);
      });

      socket.on("playField", (data) => {
        console.log(`Field played`);

        const { row, col, board, ai } = data;
        const newGameData = { 
          ...data, 
          playing: getPlaying(board),
          win: null
        }

        newGameData.nextPlaying = newGameData.playing == players.length - 1 ? 0 : newGameData.playing + 1;

        newGameData.board = playField(row, col, board, getPlaying(board));

        checkPotentialWin(newGameData.board, 5, players);
        const win = checkWin(newGameData.board, 5, players);
        if (win)
          newGameData.win = win[0];
        else 
          newGameData.win = null;

        emitPlayFieldProcessed(rooms[roomId], newGameData);
      });

      socket.on("gameUuid", (data) => {
        emitRoomData({ ...rooms[roomId], uuid: data.uuid });
      });

      socket.on("resetGame", () => {
        emitResetGameProcessed(rooms[roomId]);
      });

      socket.on("userRename", (data) => {
        rooms[roomId].players.find(client => client.socket === socket).playerName = data.newName;
        emitPlayerList(rooms[roomId]);
      });

      socket.on("disconnect", () => {
        console.log(`Client disconnected from room ${roomId}`);
        const disconnectedPlayer = rooms[roomId].players.find(client => client.socket === socket);
        
        if (disconnectedPlayer.playerHost) {
          emitRedirect(rooms[roomId], {
            type: "error",
            error: "hostDisconnected",
            message: "Zakladatel hry se odpojil"
          });

          if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
          }
        } 
        else {
          rooms[roomId].players = rooms[roomId].players.filter(client => client.socket !== socket);

          if (rooms[roomId].players.length === 0) {
            delete rooms[roomId];
          } else {
            emitPlayerList(rooms[roomId]);

            if (rooms[roomId].gameStarted) {
              emitRedirect(rooms[roomId], {
                type: "error",
                error: "playerDisconnected",
                message: "Hráč se odpojil"
              });
            }
          }
        }
      });
    }
  });

  function emitPlayerList(room) {
    const players = room.players.map(player => ({
      playerName: player.playerName,
      playerChar: player.playerChar,
      playerHost: player.playerHost,
      playerCurr: false // This will be set to true for the current player
    }));

    room.players.forEach(client => {
      const updatedPlayers = players.map(player => ({
        ...player,
        playerCurr: player.playerName === client.playerName
      }));
      client.socket.emit("updatePlayers", { players: updatedPlayers });
    });
  }
  function emitRoomData(room) {
    const sanitizedRoom = {
      gameStarted: room.gameStarted,
      uuid: room.uuid,
      players: room.players.map(player => ({
        playerName: player.playerName,
        playerChar: player.playerChar,
        playerHost: player.playerHost
      }))
    };

    room.players.forEach(client => {
      client.socket.emit("updateRoom", sanitizedRoom);
    });
  }
  function emitPlayFieldProcessed(room, gameData) {
    room.players.forEach(client => {
      client.socket.emit("playFieldProcessed", gameData);
    });
  }
  function emitResetGameProcessed(room) {
    room.players.forEach(client => {
      client.socket.emit("resetGameProcessed");
    });
  }
  function emitRedirect(room, redirectData) {
    room.players.forEach(client => {
      client.socket.emit("redirect", redirectData);
    });
  }
};
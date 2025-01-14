import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import GameBoard from "./../components/GameBoard";
import Header from "./../components/Header";
import Footer from "./../components/Footer";

interface GameSettProps {
  gameMode: string;
  uuid: string;
  playerNames: Array<String>;
  ai: Array<Number>;
}
interface RoomProps {
  gameStarted: boolean;
  players: Array<PlayerProps>;
}
interface PlayerProps {
  playerName: string;
  playerChar: string;
  playerCurr: boolean;
  playerHost: boolean;
}

function OnlineRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: roomId } = useParams<{ id: string }>();
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [player, setPlayer] = useState<PlayerProps | null>();
  const [room, setRoom] = useState<RoomProps | null>(null);
  const socketRef = useRef<Socket | null>(null);
  //@ts-ignore
  const gameSett: GameSettProps = location.state || {
    // Default values
    gameMode: "online",
    uuid: "",
    playerNames: ["Hráč 1", "Hráč 2"],
    ai: [0, 0]
  };

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    const socket = io(wsUrl, {
      query: { roomId }
    });
    socketRef.current = socket;

    socket.on("redirect", (data) => {
      if (data.type == "room") {
        navigate("/online/" + data.roomId);
      }
      else if (data.type == "error") {
        navigate("/error");
      }
    });

    socket.on("welcome", (data) => {
      console.log(data.message);
      //setPlayers(data.players);
      socket.emit("message", { message: "Hello, server!" });
    });

    socket.on("reply", (data) => {
      console.log(data.message);
    });

    socket.on("updatePlayers", (data) => {
      console.log("Players updated", data);
      setPlayers(data.players);
      setPlayer(data.players.find((player: PlayerProps) => player.playerCurr));
    });
    socket.on("updateRoom", (data) => {
      console.log("Room updated", data);
      setRoom(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, navigate]);

  function switchChars() {
    if (socketRef.current)
      socketRef.current.emit("switchChar");
  }
  function startGame() {
    if (socketRef.current)
      socketRef.current.emit("startGame");
  }

  if (room && !room.gameStarted) {
    return (
      <>
        <Header />
        <div className="bg-grad"></div>
        <div className="main-tda">
          <h1>Online Room - {roomId}</h1>
          <h2>Players:</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player.playerName} - {player.playerChar}</li>
            ))}
          </ul>
          {player?.playerHost &&
            <>
            <button onClick={switchChars}>Switch Chars</button>
            <button onClick={startGame}>Start Game</button>
            </>
          }
        </div>
        <Footer />
      </>
    );
  }
  else {
    return (
      <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-tda">
        <GameBoard 
          size={15} 
          ai={[0, 0]} 
          uuid={gameSett.uuid}
          playerNames={players.map((player) => player.playerName)} 
          playerCurr={[1, 0]}
        />
      </div>
      <Footer />
      </>
    )
  }
}

export default OnlineRoom;
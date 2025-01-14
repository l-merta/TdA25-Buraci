import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import GameBoard from "./../components/GameBoard";
import PlayerItem from "./../components/PlayerItem";
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
  //const [gameStarted, setGameStarted] = useState(false);
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
        navigate("/error", { state: data });
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

  if (!room?.gameStarted) {
    return (
      <>
        <Header />
        <div className="bg-grad"></div>
        <div className="main-room">
          <div className="code-cont">
            <h3>Kód místnosti</h3>
            <div className="group">
              <button><i className="fa-solid fa-copy"></i></button>
              <span className="code">{roomId}</span>
            </div>
          </div>
          <div className="players">
            {players && players.length > 0 && 
              <>
                <PlayerItem player={players[0]} index={0} />
                {!player?.playerHost &&
                  <button onClick={switchChars}><i className="fa-solid fa-repeat"></i></button>
                }
                {players.length > 1 && <PlayerItem player={players[1]} index={1} />}
              </>
            }
          </div>
          <div className="actions">
            {!player?.playerHost &&
              <>
              <button onClick={switchChars}>Switch Chars</button>
              <button onClick={startGame}>Start Game</button>
              </>
            }
          </div>
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
      <div className="main-game">
        <GameBoard 
          size={15} 
          replayButton={true}
          ai={[0, 0]} 
          uuid={gameSett.uuid}
          playerNames={players.map((player) => player.playerName)} 
          playerCurr={players.map((player) => player.playerCurr ? 1 : 0)}
          socket={socketRef.current}
          isHost={player?.playerHost}
        />
      </div>
      </>
    )
  }
}

export default OnlineRoom;
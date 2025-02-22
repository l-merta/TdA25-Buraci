import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useUser } from "../components/User";

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
  uuid: string;
  players: Array<PlayerProps>;
}
interface PlayerProps {
  playerName: string;
  playerChar: string;
  playerCurr: boolean;
  playerHost: boolean;
}

function OnlineRoom() {
  document.title = "Online - TdA";

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get('game');
  
  const { user, userLoading } = useUser();
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [player, setPlayer] = useState<PlayerProps | null>();
  const [room, setRoom] = useState<RoomProps | null>(null);
  const [gameCode, setGameCode] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const gameSett: GameSettProps = location.state || {
    gameMode: "online",
    uuid: "",
    playerNames: ["Hráč 1", "Hráč 2"],
    ai: [0, 0]
  };

  useEffect(() => {
    if (userLoading) return;

    if (!user && location.pathname === "/freeplay/new") {
      navigate("/login");
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    let socket;

    if (location.pathname === "/freeplay/new") {
      socket = io(wsUrl, {
        query: { roomId: null }
      });
    } else if (roomId) {
      socket = io(wsUrl, {
        query: { roomId }
      });
    }

    if (socket) {
      socketRef.current = socket;

      socket.on("redirect", (data) => {
        if (data.type == "room") {
          navigate("/freeplay?game=" + data.roomId, { state: gameSett });
        }
        else if (data.type == "error") {
          navigate("/error", { state: data });
        }
      });

      socket.on("welcome", (data) => {
        console.log(data.message);
        socket.emit("message", { message: "Hello, server!" });
      });

      socket.on("reply", (data) => {
        console.log(data.message);
      });

      socket.on("updatePlayers", (data) => {
        console.log("Players updated", data);
        setPlayers(data.players);

        const playerCurr = data.players.find((player: PlayerProps) => player.playerCurr);
        setPlayer(playerCurr);

        if (data.players.length == 1 && playerCurr.playerChar == 'O') {
          switchChars();
        }
      });

      socket.on("updateRoom", (data) => {
        console.log("Room updated", data);
        setRoom(data);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [roomId, navigate, location.pathname, user, userLoading]);

  function switchChars() {
    if (socketRef.current)
      socketRef.current.emit("switchChar");
  }
  function startGame() {
    if (socketRef.current)
      socketRef.current.emit("startGame");
  }

  function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      console.log('URL copied to clipboard:', url);
    }).catch(err => {
      console.error('Failed to copy URL:', err);
    });
  }

  if (!roomId && location.pathname !== "/freeplay/new") {
    return (
      <>
        <Header />
        <div className="bg-grad"></div>
        <div className="main-room">
          <div className="code-cont">
            <h3>Enter Game Code</h3>
            <div className="group">
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                placeholder="Enter game code"
              />
              <Link to={`/freeplay?game=${gameCode}`} className="button button-red">Join Room</Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!room?.gameStarted) {
    return (
      <>
        <Header />
        <div className="bg-grad"></div>
        <div className="main-room">
          <div className="code-cont">
            <h3>Room Code</h3>
            <div className="group">
              <button onClick={copyToClipboard}><i className="fa-solid fa-copy"></i></button>
              <span className="code">{roomId}</span>
            </div>
          </div>
          <div className="players">
            {players && players.length > 0 && 
              <>
                <PlayerItem player={players[0]} index={0} socket={socketRef.current} />
                {players.length > 1 && 
                  <>
                  {player?.playerHost &&
                    <button onClick={switchChars}><i className="fa-solid fa-repeat"></i></button>
                  }
                  <PlayerItem player={players[1]} index={1} socket={socketRef.current} />
                  </>
                }
              </>
            }
          </div>
          <div className="room-actions">
            {player?.playerHost && players.length > 1 &&
              <>
              <button className="button button-blue button-border" onClick={startGame}>Start Game</button>
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
          playerNames={players.map((player) => player.playerName)} 
          playerCurr={players.map((player) => player.playerCurr ? 1 : 0)}
          socket={socketRef.current}
          isHost={player?.playerHost}
        />
      </div>
      <Footer />
      </>
    )
  }
}

export default OnlineRoom;
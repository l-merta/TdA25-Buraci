import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import Header from "./../components/Header";
import Footer from "./../components/Footer";

interface GameSettProps {
  gameMode: string;
  playerNames: Array<String>;
  ai: Array<Number>;
}

function OnlineRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: roomId } = useParams<{ id: string }>();
  const [players, setPlayers] = useState<string[]>([]);
  //@ts-ignore
  const gameSett: GameSettProps = location.state || {
    // Default values
    gameMode: "online",
    playerNames: ["Hráč 1", "Hráč 2"],
    ai: [0, 0]
  };

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    const socket = io(wsUrl, {
      query: { roomId }
    });

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
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, navigate]);

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-tda">
        <h1>Online Room - {roomId}</h1>
        <h2>Players:</h2>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default OnlineRoom;
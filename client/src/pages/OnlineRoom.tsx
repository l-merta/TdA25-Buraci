import { useEffect } from "react";
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
  let { id: roomId } = useParams<{ id: string }>();
  //@ts-ignore
  const gameSett: GameSettProps = location.state || {
    // Default values
    gameMode: "online",
    playerNames: ["Hráč 1", "Hráč 2"],
    ai: [0, 0]
  };

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    console.log(wsUrl);
    const socket = io(wsUrl, {
      query: { roomId }
    });

    socket.on("redirect", (data) => {
      navigate(`/online/${data.roomId}`);
    });

    socket.on("welcome", (data) => {
      console.log(data.message);
      socket.emit("message", { message: "Hello, server!" });
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
      </div>
      <Footer />
    </>
  );
}

export default OnlineRoom;
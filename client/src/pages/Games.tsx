import { useState } from 'react';
import { Link } from "react-router-dom";

import GameList from './../components/GameList';
import Header from './../components/Header';
import Footer from './../components/Footer';

const Games = () => {
  document.title = "Hry - TdA";

  const gameSettArr = [
    {
      id: 0,
      gameMode: "clasic",
      playerNames: ["Hráč 1", "Hráč 2"],
      ai: [0, 0]
    },
    {
      id: 1,
      gameMode: "ai",
      playerNames: ["Hráč 1", "Táda"],
      ai: [0, 1]
    },
    {
      id: 2,
      gameMode: "online",
      playerNames: ["Hráč 1", "Hráč 2"],
      ai: [0, 0]
    },
    {
      id: 3,
      gameMode: "spectate",
      playerNames: ["Táda", "Pišk-GPT"],
      ai: [1, 1]
    }
  ];

  const [gameSett, setGameSett] = useState(gameSettArr[0]);
  const [roomCode, setRoomCode] = useState("");

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-games">
        <h1>Uložené hry piškvorek</h1>
        <h2>Vyber si způsob hry</h2>
        <div className="game-modes">
          <button className={"anim anim-scale-up mode " + (gameSett.id === 0 ? "mode-active " : " ")} onClick={() => setGameSett(gameSettArr[0])}>
            <h3>
              <i className="fa-regular fa-computer-classic"></i>
              <span>Lokální hra</span>
            </h3>
            <p>Zahraj si hru piškvorek na jednom počítači</p>
          </button>
          <button className={"anim anim-scale-up mode " + (gameSett.id === 1 ? "mode-active " : " ")} onClick={() => setGameSett(gameSettArr[1])}>
            <h3>
              <i className="fa-regular fa-microchip-ai"></i>
              <span>Proti AI</span>
            </h3>
            <p>Zkus porazit našeho AI šampióna Tádu</p>
          </button>
          <button className={"anim anim-scale-up mode " + (gameSett.id === 3 ? "mode-active " : " ")} onClick={() => setGameSett(gameSettArr[3])}>
            <h3>
              <i className="fa-regular fa-glasses"></i>
              <span>Divák</span>
            </h3>
            <p>Podívej se, jak Táda hájí svůj status šampióna proti jinému AI</p>
          </button>
          <button className={"anim anim-scale-up mode " + (gameSett.id === 2 ? "mode-active " : " ")} onClick={() => setGameSett(gameSettArr[2])}>
            <h3>
              <i className="fa-regular fa-globe"></i>
              <span>Online</span>
            </h3>
            <p>Zasoupeř si se svými kamarády nebo rodinou</p>
          </button>
        </div>
        {gameSett.gameMode === "online" && 
          <div className="online-actions anim anim-slide-from-down">
            <input 
              type="text" 
              placeholder='Kód místnosti' 
              value={roomCode} 
              onChange={(e) => setRoomCode(e.target.value)} 
            />
            <Link to={`/online/${roomCode}`} className="button button-red">Připojit se</Link>
            <Link to={gameSett.gameMode !== "online" ? "/game/" : "/online/"} state={gameSett} className="button button-red button-border">Vytvořit místnost</Link>
          </div>
        }
        {gameSett.gameMode !== "online" && 
          <>
          <div className="play-actions anim anim-slide-from-down">
            <Link to={gameSett.gameMode !== "online" ? "/game/" : "/online/"} state={gameSett} className="button button-1 button-red">Nová hra</Link>
            <Link to="/create/" className="button button-1 button-red button-border">Vytvořit hru</Link>
          </div>
          <GameList gameSett={gameSett} />
          </>
        }
      </div>
      <Footer />
    </>
  );
};

export default Games;

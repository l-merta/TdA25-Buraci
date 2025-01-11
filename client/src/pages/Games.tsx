import { useState } from 'react';
import GameList from './../components/GameList';
//import { Link } from "react-router-dom";

import Header from './../components/Header';
import Footer from './../components/Footer';

const Games = () => {
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
    }
  ];

  const [gameSett, setGameSett] = useState(gameSettArr[0]);

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-games">
        <h1>Uložené hry piškvorek</h1>
        <h2>Vyber si způsob hry</h2>
        <div className="game-modes">
          <button className={"mode " + (gameSett.id === 0 ? "mode-active " : " ")} onClick={() => setGameSett(gameSettArr[0])}>
            <h3>
              <span>Lokální hra</span>
              <i className="fa-regular fa-computer-classic"></i>
            </h3>
            <p>Zahraj si hru piškvorek na jednom počítači</p>
          </button>
          <button className={"mode " + (gameSett.id === 1 ? "mode-active " : " ")} onClick={() => setGameSett(gameSettArr[1])}>
            <h3>
              <span>Proti AI</span>
              <i className="fa-regular fa-microchip-ai"></i>
            </h3>
            <p>Zkus porazit našeho AI šampióna Tádu!</p>
          </button>
        </div>
        <GameList gameSett={gameSett} />
      </div>
      <Footer />
    </>
  )
}

export default Games

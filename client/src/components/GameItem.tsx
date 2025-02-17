import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useTheme, themeToImg } from './ThemeHandler';

import Loading from './Loading';
import GameBoard from './GameBoard';

interface GameProps {
  game: any;
  index: number;
  setGames: any;
  gameSett: any;
}

const GameItem:React.FC<GameProps> = ({ game, index, setGames, gameSett }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const theme = useTheme();

  const [popupVisible, setPopupVisible] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  async function deleteGame(uuid: string) {
    handleDeleteClick(uuid);
    try {
      const response = await fetch(`${apiUrl}games/${uuid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted game from the state
      setGames((games: any) => games.filter((game: any) => game.uuid !== uuid));
    } catch (error: any) {
      console.log(error.message); // Handle error
    }
  }

  const togglePopup = (uuid: string) => {
    if (!popupVisible)
      setPopupVisible(popupVisible === uuid ? null : uuid);
  };
  const handleDeleteClick = (uuid: string) => {
    setLoadingDelete(uuid);
    // Simulate an API call to delete the game
    setTimeout(() => {
      // After the API call, you can remove the game from the list or handle it accordingly
      setLoadingDelete(null); // Reset the loading state
    }, 2000);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setTimeout(() => {
        setPopupVisible(null);
      }, 100);
    }
  };

  useEffect(() => {
    if (popupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupVisible]);

  return (
    <div className={"game anim anim-slide-from-down"} style={{ animationDelay: index * 0.08 + "s" }}>
      <div className="text">
        <div className="group">
          <div className="img-cont">
            <img src={"/images/icons/zarivka_" + game.difficulty + "_" + themeToImg(theme, ".png")} alt="Obtížnost" />
          </div>
          <div className="s2">
            <span className="game-name">{game.name}</span>
            <div className="actions">
              <Link to={gameSett.gameMode != "online" ? ("/game/" + game.uuid) : "/online/"}
                state={gameSett.gameMode != "online" ? gameSett : { ...gameSett, uuid: game.uuid }}
                className="button button-blue"
              >Hrát</Link>
              {/* <button className="button button-red button-border">Náhled</button> */}
            </div>
          </div>
        </div>
        <div className="s3">
          <button className="button button-dots" onClick={() => togglePopup(game.uuid)}>
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
          {popupVisible === game.uuid && (
            <div className="popup" ref={popupRef}>
              <Link to={"/create/" + game.uuid} className="button button-edit">
                <i className="fa-solid fa-pen-to-square"></i>
                Upravit úlohu
              </Link>
              <button className="button button-warning" onClick={() => deleteGame(game.uuid)}>
                {loadingDelete === game.uuid ? 
                  <Loading size="30" /> :
                  <>
                  <i className="fa-regular fa-trash"></i>
                  Smazat úlohu
                  </>
                }
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="att">
        <span className={"game-difficulty game-difficulty-" + game.difficulty}>
          <span>{game.difficulty}</span>
        </span>
        <span className="game-state">{game.gameState}</span>
      </div>
      <GameBoard size={15} uuid={game.uuid} onlyBoard={true} ai={[0, 0]} playerCurr={[0, 0]} />
    </div>
  )
}

export default GameItem
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useTheme, themeToImg } from './ThemeHandler';

import Loading from './Loading';

interface GamesProps {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  difficulty: string;
  gameState: string;
  board: Array<String>;
}

const GameList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // Initialize useNavigate
  const theme = useTheme();

  const [games, setGames] = useState<Array<GamesProps>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popupVisible, setPopupVisible] = useState<any>(null);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(apiUrl + "games"); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json(); // Parse JSON data
        setIsLoading(false);
        setGames(result);
      } catch (error: any) {
        console.log(error.message); // Set error message if there's an issue
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount
  
  function playGame(uuid: string) {
    navigate(`/game/${uuid}`); // Redirect to the game page
  }

  async function editGame(uuid: string) {
    // Redirect to the edit page
    navigate(`/create/${uuid}`);
  }

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
      setGames(games.filter(game => game.uuid !== uuid));
      console.log(`Game with UUID ${uuid} deleted successfully.`);
    } catch (error: any) {
      console.log(error.message); // Handle error
    }
  }

  const togglePopup = (uuid: string) => {
    setPopupVisible(popupVisible === uuid ? null : uuid);
  };
  const handleDeleteClick = (uuid: string) => {
    setLoadingDelete(uuid);
    // Simulate an API call to delete the game
    setTimeout(() => {
      // After the API call, you can remove the game from the list or handle it accordingly
      console.log(`Game with UUID ${uuid} deleted`);
      setLoadingDelete(null); // Reset the loading state
    }, 2000);
  };

  if (isLoading) {
    console.log("no games");
    return <Loading />;
  }
  else {
    return (
      <div className="games-list">
        {games && games.map((game) => (
          <div className="game" key={game.uuid}>
            <div className="text">
              <div className="group">
                <div className="img-cont">
                  <img src={"/images/icons/zarivka_" + game.difficulty + "_" + themeToImg(theme, ".png")} alt="Obtížnost" />
                </div>
                <div className="s2">
                  <span className="game-name">{game.name}</span>
                  <div className="actions">
                    <Link to={"/game/" + game.uuid} className="button button-blue">Hrát</Link>
                    <button className="button button-red button-border">Náhled</button>
                  </div>
                </div>
              </div>
              <div className="s3">
                <button className="button button-dots" onClick={() => togglePopup(game.uuid)}>
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                {popupVisible === game.uuid && (
                  <div className="popup">
                    <button className="button button-edit" onClick={() => editGame(game.uuid)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                      Upravit úlohu
                    </button>
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
          </div>
        ))}
      </div>
    );
  }
}

export default GameList;
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useTheme, themeToImg } from './ThemeHandler';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + "games"); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json(); // Parse JSON data
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

  return (
    <div className="games-list">
      {games && games.map((game) => (
        <div className="game" key={game.uuid}>
          <div className="text">
            <div className="img-cont">
              <img src={"/images/icons/zarivka_" + game.difficulty + "_" + themeToImg(theme, ".png")} alt="Obtížnost" />
            </div>
            <div className="s2">
              <span className="game-name">{game.name}</span>
              <div className="actions">
                <Link to={"/game/" + game.uuid} className="button button-blue">Hrát</Link>
                {/* <button onClick={() => playGame(game.uuid)} className="button button-blue">Hrát</button> */}
                <button className="button button-red button-border">Náhled</button>
                {/* <button onClick={() => editGame(game.uuid)} className="button-main"><i className="fa-regular fa-pen-to-square"></i></button> */}
                {/* <button onClick={() => deleteGame(game.uuid)} className="button-main button-warning"><i className="fa-regular fa-trash"></i></button> */}
              </div>
            </div>
          </div>
          <div className="att">
            <span className={"game-difficulty game-difficulty-" + game.difficulty}>{game.difficulty}</span>
            <span className="game-state">{game.gameState}</span>
          </div>
          {/* <div className="text">
            <span className="game-name">{game.name}</span>
            <div className="att">
              <span className={"game-difficulty game-difficulty-" + game.difficulty}>{game.difficulty}</span>
              <span className="game-state">{game.gameState}</span>
            </div>
          </div>
          <div className="actions">
            <button onClick={() => playGame(game.uuid)} className="button-main">Hrát</button>
            <button onClick={() => editGame(game.uuid)} className="button-main"><i className="fa-regular fa-pen-to-square"></i></button>
            <button onClick={() => deleteGame(game.uuid)} className="button-main button-warning"><i className="fa-regular fa-trash"></i></button>
          </div> */}
        </div>
      ))}
    </div>
  );
}

export default GameList;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

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
  const [games, setGames] = useState<Array<GamesProps>>([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + "games"); // Replace with your API URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json(); // Parse JSON data
        setGames(result);
        console.log(result);
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
    <div className="games-list" style={{ maxWidth: "45rem"}}>
      {games && games.map((game) => (
        <div className="game" key={game.uuid}>
          <span className="game-name">{game.name}</span>
          <div className="actions">
            <button onClick={() => playGame(game.uuid)}>Hrát</button>
            <button onClick={() => editGame(game.uuid)}><i className="fa-regular fa-pen-to-square"></i></button>
            <button onClick={() => deleteGame(game.uuid)} className="button-warning"><i className="fa-regular fa-trash"></i></button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GameList;
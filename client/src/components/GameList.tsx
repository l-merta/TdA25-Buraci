import { useState, useEffect } from 'react';

import Loading from './Loading';
import GameItem from './GameItem';

interface GamesProps {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  difficulty: string;
  gameState: string;
  board: Array<String>;
}
interface GameListProps {
  gameSett: any;
}

const GameList:React.FC<GameListProps> = ({ gameSett }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [games, setGames] = useState<Array<GamesProps>>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  if (isLoading) {
    return <Loading />;
  }
  else {
    return (
      <div className="games-list">
        {games && games.map((game) => (
          <GameItem game={game} setGames={setGames} key={game.uuid} gameSett={gameSett} />
        ))}
      </div>
    );
  }
}

export default GameList;
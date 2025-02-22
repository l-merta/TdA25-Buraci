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

const GameList: React.FC<GameListProps> = ({ gameSett }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [games, setGames] = useState<Array<GamesProps>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ name: '', difficulty: '', lastModified: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(`${apiUrl}games?${query}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setIsLoading(false);
        setGames(result);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="games-list">
      <div className="filter anim anim-slide-from-down">
        <input
          type="text"
          name="name"
          placeholder="Hledat podle jména"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <div className="menus">
          <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
            <option value="">Všechny obtížnosti</option>
            <option value="beginner">Beginner</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="extreme">Extreme</option>
          </select>
          <input
            type="date"
            name="lastModified"
            placeholder="Filter by last modified"
            value={filters.lastModified}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      {!isLoading ? 
        <>
        {games.length === 0 && <p className='nothing-found'>Nic jsme tu nenašli..</p>}
        <div className='games'>
          {games && games.map((game, index) => (
            <GameItem game={game} setGames={setGames} key={game.uuid} index={index} gameSett={gameSett} />
          ))}
        </div>
        </>
        :
        <Loading />
      }
    </div>
  );
};

export default GameList;
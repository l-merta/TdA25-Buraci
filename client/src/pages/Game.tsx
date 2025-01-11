import { useLocation } from "react-router-dom";

import Header from "./../components/Header";
import GameBoard from "./../components/GameBoard";

interface GameSettProps {
  gameMode: string;
  playerNames: Array<String>;
  ai: Array<Number>;
}

const Game = () => {
  const location = useLocation();
  const gameSett: GameSettProps = location.state || {
    // Default values
    gameMode: "clasic",
    playerNames: ["Hráč 1", "Hráč 2"],
    ai: [0, 0]
  };

  console.log(gameSett);

  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-game">
        {/* <Link to="/games">Games</Link> */}
        <GameBoard size={15} replayButton={true} playerNames={gameSett.playerNames} ai={gameSett.ai} />
      </div>
    </>
  )
}

export default Game

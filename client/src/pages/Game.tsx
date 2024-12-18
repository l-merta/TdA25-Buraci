import GameBoard from "./../components/GameBoard";
import { Link } from "react-router-dom";

const Game = () => {
  return (
    <>
      <Link to="/games">Games</Link>
      <h1>Game page</h1>
      <GameBoard size={15} />
    </>
  )
}

export default Game

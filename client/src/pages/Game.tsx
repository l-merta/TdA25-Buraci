import { Link } from "react-router-dom";

import GameBoard from "./../components/GameBoard";

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

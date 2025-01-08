//import { Link } from "react-router-dom";

import Header from "./../components/Header";
import GameBoard from "./../components/GameBoard";

const Game = () => {
  return (
    <>
      <Header />
      <div className="bg-grad"></div>
      <div className="main-game">
        {/* <Link to="/games">Games</Link> */}
        <GameBoard size={15} />
      </div>
    </>
  )
}

export default Game

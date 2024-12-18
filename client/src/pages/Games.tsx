import GameList from './../components/GameList';
import { Link } from "react-router-dom";

const Games = () => {
  return (
    <>
      <Link to="/">Home</Link>
      <h1>Uložené hry piškvorek</h1>
      <GameList></GameList>
    </>
  )
}

export default Games

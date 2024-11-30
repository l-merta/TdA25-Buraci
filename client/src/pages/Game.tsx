import { Link } from "react-router-dom";

const Game = () => {
  return (
    <>
        <h1>Game page</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create</Link></li>
          </ul>
        </nav>
    </>
  )
}

export default Game

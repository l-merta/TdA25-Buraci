import { Link } from "react-router-dom";

const Create = () => {
  return (
    <>
        <h1>Create page</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/game">Game</Link></li>
          </ul>
        </nav>
    </>
  )
}

export default Create

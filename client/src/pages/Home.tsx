//@ts-ignore
import React, { useEffect } from 'react'
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <h1>Home page</h1>
      <nav>
        <ul>
          <li><Link to="/game">Game</Link></li>
          <li><Link to="/games">Games</Link></li>
          <li><Link to="/create">Create</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default App
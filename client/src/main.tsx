import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home.tsx'
import Game from './pages/Game.tsx'
import GameList from './pages/GameList.tsx'
import Create from './pages/Create.tsx'
import Error from './pages/Error.tsx'

import './styles/index.css'
import './styles/main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game-list" element={<GameList />} />
        <Route path="/create" element={<Create />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  </StrictMode>,
)

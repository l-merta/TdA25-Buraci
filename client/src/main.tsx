import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home.tsx'
import Game from './pages/Game.tsx'
import Create from './pages/Create.tsx'

import './styles/index.css'
import './styles/main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
  </StrictMode>,
)

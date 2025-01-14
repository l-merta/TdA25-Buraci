import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './pages/Home.tsx';
import Game from './pages/Game.tsx';
import GameList from './pages/Games.tsx';
import OnlineRoom from './pages/OnlineRoom.tsx';
import Create from './pages/Create.tsx';
import Tda from './pages/Tda.tsx';
import Team from './pages/Team.tsx';
import PageNotFound from './pages/ErrorPage.tsx';

import './styles/index.css';
import './styles/main.css';
import './styles/game.css';
import './styles/game-list.css';
import './styles/tda.css';
import './styles/team-page.css';
import './styles/error-page.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game/:uuid" element={<Game />} />
        <Route path="/games" element={<GameList />} />
        <Route path="/online" element={<OnlineRoom />} />
        <Route path="/online/:id" element={<OnlineRoom />} />
        <Route path="/create" element={<Create />} />
        <Route path="/create/:uuid" element={<Create />} />
        <Route path="/think-different-academy" element={<Tda />} />
        <Route path="/about-team" element={<Team />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
  </StrictMode>,
)

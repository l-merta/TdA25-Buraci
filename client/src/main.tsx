import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserProvider } from './components/User';

import Home from './pages/Home.tsx';
import Game from './pages/Game.tsx';
import GameList from './pages/Games.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import OnlineRoom from './pages/OnlineRoom.tsx';
import Create from './pages/Create.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import UserPage from './pages/UserPage.tsx';
import Tda from './pages/Tda.tsx';
import Team from './pages/Team.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import PageNotFound from './pages/ErrorPage.tsx';

import './styles/index.css';
import './styles/main.css';
import './styles/game.css';
import './styles/game-list.css';
import './styles/leaderboard.css';
import './styles/login.css';
import './styles/online.css'
import './styles/user-page.css';
import './styles/tda.css';
import './styles/admin.css';
import './styles/user.css';
import './styles/team-page.css';
import './styles/error-page.css';

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/:uuid" element={<Game />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/freeplay" element={<OnlineRoom />} />
          <Route path="/freeplay/new" element={<OnlineRoom />} />
          <Route path="/online" element={<OnlineRoom />} />
          <Route path="/create" element={<Create />} />
          <Route path="/create/:uuid" element={<Create />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/registration" element={<SignUp />} />
          <Route path="/users/:username" element={<UserPage />} />
          <Route path="/think-different-academy" element={<Tda />} />
          <Route path="/about-team" element={<Team />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </StrictMode>,
  </UserProvider>
);

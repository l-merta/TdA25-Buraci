import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Header from './../components/Header';
import Footer from './../components/Footer';
import ProfilePic from './../components/ProfilePic';

interface UserProps {
  username: string;
  role: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
}

function UserPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { username } = useParams();

  document.title = `${username} - TdA`;

  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}users/username/${username}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, [username]);

  if (user) return (
    <>
      <Header/>
      <div className="bg-grad"></div>
      <div className="main-user anim anim-slide-from-down">
        <div className="info">
          <div className='subinfo'>
            <ProfilePic user={user} />
            <div className="s1">
              <h1 className='username'>{user.username}</h1>
              <span className="elo">
                <i className="fa-solid fa-trophy"></i>
                <span>{user.elo}</span>
                <span className='index'>2. místo</span>
              </span>
              <div className="timestamp">
                Založen 1.1. 2005
              </div>
            </div>
          </div>
          <div className="user-data">
            <div className="item item-wins">
              <span className="value">{user.wins}</span>
              <span className='label'>Výhry</span>
            </div>
            <div className="item item-losses">
              <span className="value">{user.losses}</span>
              <span className='label'>Prohry</span>
            </div>
            <div className="item item-draws">
              <span className="value">{user.draws}</span>
              <span className='label'>Remízy</span>
            </div>
          </div>
        </div>
        <div className="game-history">
          <h2>Historie her</h2>
        </div>
      </div>
      <Footer />
    </>
  )
  else return (
    <>
    <Header active='admin'/>
    <div className="bg-grad"></div>
    <div className="main-user anim anim-slide-from-down">
      <h1>Hledám uživatele {username}</h1>
    </div>
    <Footer />
    </>
  )
}

export default UserPage;
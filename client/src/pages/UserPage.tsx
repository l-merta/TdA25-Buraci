import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Header from './../components/Header';
import Footer from './../components/Footer';
import ProfilePic from './../components/ProfilePic';

interface UserProps {
  uuid: string;
  username: string;
  role: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
  createdAt: string;
}

function UserPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { username } = useParams();

  document.title = `${username} - TdA`;

  const [user, setUser] = useState<UserProps | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}users/username/${username}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, [username]);
  
  useEffect(() => {
    if (!user) return;
    axios.get(`${apiUrl}users/rank/${user.uuid}`, {
      headers: {
        //'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setRank(response.data.rank);
    })
    //.catch(error => {});
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day}.${month}. ${year}`;
  };

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
                {rank && <span className='index'>{rank}. místo</span>}
              </span>
              <div className="timestamp">
                Vytvořen {formatDate(user.createdAt)}
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
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

  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}users/username/${username}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, [username]);

  document.title = `Stránka uživatele ${username}`;

  if (user) return (
    <>
      <Header active='admin'/>
      <div className="bg-grad"></div>
      <div className="main-user anim anim-slide-from-down">
        <div className="info">
          <ProfilePic user={user} />
          <div className="s1">
            <h1 className='username'>{user.username}</h1>
            <span className="elo">
              <i className="fa-solid fa-trophy"></i>
              {user.elo}
            </span>
          </div>
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
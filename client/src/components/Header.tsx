import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./User";

import ProfilePic from "./ProfilePic";

interface HeaderProps {
  active?: string;
}

const Header: React.FC<HeaderProps> = ({ active }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'theme-light');
  const { user, logout } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const originalSetItem: any = localStorage.setItem;

    localStorage.setItem = function(key, value) {
      const event: any = new Event('itemInserted');
      event.value = value; // Optional..
      event.key = key; // Optional..
      document.dispatchEvent(event);
      originalSetItem.apply(this, arguments);
    };

    return () => {
      localStorage.setItem = originalSetItem; // Restore original method on cleanup
    };
  }, []);

  function switchColorTheme() {
    const newTheme = theme === 'theme-light' ? 'theme-dark' : 'theme-light';
    setTheme(newTheme);
  }

  return (
    <header>
      <Link to="/"><img src="/images/logos/Think-different-Academy_LOGO_oficialni-bile.png" alt="" /></Link>
      <div className="actions">
        <Link to="/games" className={'button button-0 button-empty ' + (active === 'games' ? 'header-active ' : ' ')}>
          <span>Seznam her</span>
          <div className="line"></div>
        </Link>
        <Link to="/leaderboard" className={'button button-0 button-empty ' + (active === 'leaderboard' ? 'header-active ' : ' ')}>
          <span>Žebříček</span>
          <div className="line"></div>
        </Link>
        {user && user.role == 'admin' && (
          <Link to="/admin-dashboard" className={'button button-0 button-empty ' + (active === 'admin' ? 'header-active ' : ' ')}>
            <span>Admin Panel</span>
            <div className="line"></div>
          </Link>
        )}
        <Link to="/think-different-academy" className={'button button-0 button-empty ' + (active === 'tda' ? 'header-active ' : ' ')}>
          <span>O TdA</span>
          <div className="line"></div>
        </Link>
        <Link to="/about-team" className={'button button-0 button-empty ' + (active === 'team' ? 'header-active ' : ' ')}>
          <span>O týmu a aplikaci</span>
          <div className="line"></div>
        </Link>
      </div>
      <div className="actions-2">
        <button className="theme-switch" onClick={switchColorTheme}>
          <i className={theme === 'theme-light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun-bright'}></i>
        </button>
        {/* <Link to="/game" className='button button-red'>Nová hra</Link> */}
        {user ? (
          <>
          <Link to={"/users/" + user.username} className='user'>
            <div className="data">
              <span className="username">{user.username}</span>
              <div className="elo">
                <i className="fa-solid fa-trophy"></i>
                <span>{user.elo}</span>
              </div>
            </div>
            <ProfilePic user={user} />
          </Link>
          <Link to={"/login"} onClick={logout} className='logout'>
            <i className="fa-solid fa-right-from-bracket"></i>
          </Link>
          </>
        ) : (
          <Link to="/login" className='button button-red'>Přihlásit se</Link>
        )}
      </div>
      <div className="burger-menu">
        <button className="theme-switch" onClick={switchColorTheme}>
          <i className={theme === 'theme-light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun-bright'}></i>
        </button>
        <button className="burger-button" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fa-solid fa-bars"></i>
        </button>
        {menuOpen && (
          <nav className="burger-nav">
            <Link to="/games" className='button button-0 button-empty'>Seznam her</Link>
            <Link to="/leaderboard" className='button button-0 button-empty'>Žebříček</Link>
            <Link to="/think-different-academy" className='button button-0 button-empty'>O TdA</Link>
            <Link to="/about-team" className='button button-0 button-empty'>O týmu a aplikaci</Link>
            <Link to="/game" className='button button-0 button-red'>Nová hra</Link>
            {user ? (
              <>
              <Link to="/login" onClick={logout} className='button button-0 button-red button-border'>
                <i className="fa-solid fa-right-from-bracket"></i>
                Odhlásit se
              </Link>
              <Link to={"/users/" + user.username} className='user'>
                <ProfilePic user={user} />
                <div className="data">
                  <span className="username">{user.username}</span>
                  {/* <div className="elo">
                    <i className="fa-solid fa-trophy"></i>
                    <span>{user.elo}</span>
                  </div> */}
                </div>
              </Link>
              <Link to={"/login"} onClick={logout} className='logout'>
                
              </Link>
              </>
            ) : (
              <Link to="/login" className='button button-red button-border'>Přihlásit se</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;

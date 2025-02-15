import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./User";

interface HeaderProps {
  active?: string;
}

const Header: React.FC<HeaderProps> = ({ active }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'theme-light');
  const { user } = useUser();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  function switchColorTheme() {
    const newTheme = theme === 'theme-light' ? 'theme-dark' : 'theme-light';
    setTheme(newTheme);
  }

  return (
    <header>
      <Link to="/"><img src="/images/logos/Think-different-Academy_LOGO_oficialni-bile.png" alt="" /></Link>
      <div className="actions">
        <Link to="/games" className={'button button-empty ' + (active === 'games' ? 'header-active ' : ' ')}>
          <span>Seznam her</span>
          <div className="line"></div>
        </Link>
        {user && user.role == 'admin' && (
          <Link to="/admin-dashboard" className={'button button-empty ' + (active === 'admin' ? 'header-active ' : ' ')}>
          <span>Admin Panel</span>
          <div className="line"></div>
        </Link>
        )}
        <Link to="/think-different-academy" className={'button button-empty ' + (active === 'tda' ? 'header-active ' : ' ')}>
          <span>O TdA</span>
          <div className="line"></div>
        </Link>
        <Link to="/about-team" className={'button button-empty ' + (active === 'team' ? 'header-active ' : ' ')}>
          <span>O týmu a aplikaci</span>
          <div className="line"></div>
        </Link>
      </div>
      <div className="actions-2">
        <button className="theme-switch" onClick={switchColorTheme}>
          <i className={theme === 'theme-light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun-bright'}></i>
        </button>
        <Link to="/game" className='button button-red'>Nová hra</Link>
        {user ? (
          <span className='button button-red button-border'>{user.username}</span>
        ) : (
          <Link to="/login" className='button button-red button-border'>Přihlásit se</Link>
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
            <Link to="/games" className='button button-empty'>Seznam her</Link>
            <Link to="/think-different-academy" className='button button-empty'>O TdA</Link>
            <Link to="/about-team" className='button button-empty'>O týmu a aplikaci</Link>
            <Link to="/game" className='button button-red'>Nová hra</Link>
            {user ? (
              <span className='button button-red button-border'>{user.username}</span>
            ) : (
              <Link to="/login" className='button button-red button-border'>Přihlásit se</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header;

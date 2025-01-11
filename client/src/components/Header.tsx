import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'theme-light');

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
    localStorage.setItem('theme', newTheme); // Ensure localStorage is updated after state change
  }

  return (
    <header>
      <Link to="/"><img src="/images/logos/Think-different-Academy_LOGO_oficialni-bile.png" alt="" /></Link>
      <div className="actions">
        <Link to="/games" className='button button-empty'>Seznam her</Link>
        <Link to="/think-different-academy" className='button button-empty'>O TdA</Link>
        <Link to="/about-team" className='button button-empty'>O týmu a aplikaci</Link>
      </div>
      <div className="actions-2">
        <button className="theme-switch" onClick={switchColorTheme}>
          <i className={theme === 'theme-light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun-bright'}></i>
        </button>
        <Link to="/game" className='button button-red'>Nová hra</Link>
      </div>
    </header>
  )
}

export default Header;

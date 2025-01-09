import { useEffect, useState } from 'react';

const ThemeHandler = () => {
  return null; // This component does not render anything
};

export const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'theme-light');

  useEffect(() => {
    const handleStorageChange = (e: any) => {
      if (e.key === 'theme') {
        const newTheme = e.value || 'theme-light';
        setTheme(newTheme);
      }
    };

    document.addEventListener('itemInserted', handleStorageChange);

    return () => {
      document.removeEventListener('itemInserted', handleStorageChange);
    };
  }, []);

  return theme;
};

export const themeToImg = (theme: any, ext: string, swap: boolean = false) => {
  return theme === "theme-light" ? 
    (swap ? "bile" + ext : "cerne" + ext) :
    (swap ? "cerne" + ext : "bile" + ext)
};

export default ThemeHandler;
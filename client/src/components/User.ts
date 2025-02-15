import { useState, useEffect } from "react";

interface UserProps {
  username: string;
  email: string;
  role: string;
}

export const useUser = () => {
  const [user, setUser] = useState<UserProps | null>(JSON.parse(localStorage.getItem('user') || 'null'));

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

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };

    document.addEventListener('itemInserted', handleStorageChange);

    return () => {
      document.removeEventListener('itemInserted', handleStorageChange);
    };
  }, []);

  return { user, setUser };
};
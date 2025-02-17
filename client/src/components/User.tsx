import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';

interface User {
  uuid: string;
  username: string;
  email: string;
  role: string;
  elo: number;
  wins: number;
  draws: number;
  losses: number;
}

interface UserContextType {
  user: User | null;
  userLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(apiUrl + 'getUserByToken', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setUserLoading(false);
      });
    } else {
      setUserLoading(false);
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, userLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
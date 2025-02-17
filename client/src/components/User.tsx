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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
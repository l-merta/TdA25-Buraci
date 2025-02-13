import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import Header from './../components/Header';

const SignIn = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [nameOrEmail, setNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = { nameOrEmail, password };

    try {
      const response = await fetch(apiUrl + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const loginData = await response.json();
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        console.log(loginData.user);
        navigate('/'); // Redirect to home page or any other page
      } else {
        const errorData = await response.json();
        setError('Invalid username/email or password');
        console.error('Error logging in:', errorData);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error logging in');
    }
  };

  return (
    <>
      <Header active='team'/>
      <div className="bg-grad"></div>
      <div className="main-login anim anim-slide-from-down">
        <form onSubmit={handleSubmit}>
          <h1>Přihlášení</h1>
          <input
            type="text"
            placeholder='Uživatelské jméno / email'
            value={nameOrEmail}
            onChange={(e) => setNameOrEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder='Heslo'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <p className='redirect'>Jestě nemáš účet? <Link to='/registration'>Zaregistruj se</Link></p>
          <button className='button button-blue' type="submit">Pokračovat</button>
        </form>
      </div>
    </>
  );
};

export default SignIn;

import React, { useState } from 'react';
import { Link } from "react-router-dom";

import Header from './../components/Header';

const SignUp = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = { username, email, password, passwordAgain };

    try {
      const response = await fetch(apiUrl + 'users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User created:', data);
        // Handle success (e.g., show a success message, redirect, etc.)
      } else {
        const errorData = await response.json();
        console.error('Error creating user:', errorData);
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <>
      <Header active='team'/>
      <div className="bg-grad"></div>
      <div className="main-login anim anim-slide-from-down">
        <form onSubmit={handleSubmit}>
          <h1>Registrace</h1>
          <input
            type="text"
            placeholder='Uživatelské jméno'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder='Heslo'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder='Opakovat heslo'
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            required
          />
          <p className='redirect'>Už máš účet? <Link to='/login'>Přihlaš se</Link></p>
          <button className='button button-blue' type="submit">Pokračovat</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;

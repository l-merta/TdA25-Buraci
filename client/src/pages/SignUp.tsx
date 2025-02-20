import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useUser } from './../components/User';

import Header from './../components/Header';

const SignUp = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { login } = useUser();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordAgain) {
      setError('Hesla se neshodují');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Heslo musí obsahovat alespoň 8 znaků, malá i velká písmena, číslice a speciální znak');
      return;
    }

    const user = { username, email, password };

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

        // Automatically log in the user
        const loginResponse = await fetch(apiUrl + 'login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nameOrEmail: email, password }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          login(loginData.token, loginData.user);
          navigate('/'); // Redirect to home page or any other page
        } else {
          setError('Chyba při přihlašování po registraci');
        }
      } else {
        const errorData = await response.json();
        if (errorData.message.toLowerCase().includes('username')) {
          setError('Uživatelské jméno je již obsazeno');
        } else if (errorData.message.toLowerCase().includes('email')) {
          setError('Email je již použitý');
        } else {
          setError('Chyba při vytváření uživatele');
        }
        console.error('Error creating user:', errorData);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Chyba při vytváření uživatele');
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
          {error && <p className="error">{error}</p>}
          <p className='redirect'>Už máš účet? <Link to='/login'>Přihlaš se</Link></p>
          <button className='button button-blue' type="submit">Pokračovat</button>
        </form>
      </div>
    </>
  );
};

export default SignUp;

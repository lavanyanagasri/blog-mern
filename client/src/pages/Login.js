import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Login = () => {
  const [username, setuser] = useState('');
  const [password, setpassword] = useState('');
  const [redirect, setredirect] = useState(false);
  const { setuserinfo } = useContext(UserContext);
  const BASE_URL = process.env.REACT_APP_API_URL;

  async function login(e) {
    e.preventDefault();

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      const userinfo = await response.json();
      setuserinfo(userinfo);
      setredirect(true);
      alert('Login successful!');
      console.log('Logged in as:', userinfo.username);
    } else {
      const error = await response.json();
      alert('Login failed: ' + error.message);
    }
  }

  if (redirect) {
    return <Navigate to='/' />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={login}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
        
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setuser(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

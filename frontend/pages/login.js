'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMsg('');
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        router.push('/chat');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Invalid credentials or server error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-indigo-800 to-black">
      <div className="bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-2xl w-full max-w-md border border-indigo-600">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-300">🔐 Login</h2>

        {errorMsg && (
          <div className="bg-red-500 bg-opacity-20 text-red-300 p-2 mb-4 rounded">
            ⚠️ {errorMsg}
          </div>
        )}

        <input
          className="mb-4 w-full px-4 py-2 border border-indigo-600 bg-gray-900 text-indigo-100 rounded placeholder-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-4 w-full px-4 py-2 border border-indigo-600 bg-gray-900 text-indigo-100 rounded placeholder-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 rounded hover:scale-105 transition transform duration-300"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-indigo-400">
          Don’t have an account?{' '}
          <a className="text-purple-400 underline hover:text-purple-300" href="/signup">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}

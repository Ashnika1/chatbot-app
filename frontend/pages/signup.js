'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const BACKEND_URL = 'https://chatbot-backend-q8fe.onrender.com';

  const handleSignup = async () => {
    setErrorMsg('');
    try {
      const res = await axios.post(`${BACKEND_URL}/api/signup`, { email, password });

      if (res.status === 201) {
        alert('Signup successful! Please login.');
        router.push('/login');
      } else {
        setErrorMsg(res.data.msg || 'Signup failed');
      }
    } catch (err) {
      setErrorMsg('Something went wrong');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-800 to-black">
      <div className="bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-600">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">📝 Signup</h2>

        {errorMsg && (
          <div className="bg-red-500 bg-opacity-20 text-red-300 p-2 mb-4 rounded">
            ⚠️ {errorMsg}
          </div>
        )}

        <input
          className="mb-4 w-full px-4 py-2 border border-purple-600 bg-gray-900 text-purple-100 rounded placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-4 w-full px-4 py-2 border border-purple-600 bg-gray-900 text-purple-100 rounded placeholder-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded hover:scale-105 transition transform duration-300"
          onClick={handleSignup}
        >
          Signup
        </button>

        <p className="mt-4 text-center text-sm text-purple-400">
          Already have an account?{' '}
          <a className="text-indigo-400 underline hover:text-indigo-300" href="/login">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

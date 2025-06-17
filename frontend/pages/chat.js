'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const BACKEND_URL = 'https://chatbot-backend-q8fe.onrender.com'; // 🔥 your deployed backend URL

  const handleClearChat = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${BACKEND_URL}/api/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
      alert('Failed to clear chat history.');
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem('token');
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/pdf/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const pdfText = res.data.text;
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `📄 Uploaded: ${file.name}` },
        { role: 'bot', content: `📑 PDF Text:\n\n${pdfText}` },
      ]);
    } catch (err) {
      console.error('PDF Upload Error:', err.response?.data || err.message);
      alert('Failed to upload PDF');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchHistory(token);
    }
  }, []);

  const fetchHistory = async (token) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem('token');
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/chat`, { message: input }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const botMsg = { role: 'bot', content: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      alert('❌ Chatbot failed to respond.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const theme = darkMode
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white'
    : 'bg-gradient-to-br from-yellow-100 to-white text-black';

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme} px-4`}>
      <div className="w-full max-w-3xl p-6 rounded-2xl shadow-2xl border border-purple-500 bg-opacity-90">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-purple-300 animate-pulse">🤖 AI Chatbot</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-purple-600 hover:bg-purple-800 text-white px-3 py-1 rounded-lg shadow"
          >
            {darkMode ? '🌙 Dark' : '🌞 Light'}
          </button>
        </div>

        <div className="h-[350px] overflow-y-auto p-4 bg-[#1c1c2b] rounded-xl border border-purple-500 shadow-inner space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712039.png"
                  alt="Bot Avatar"
                  className="w-8 h-8 mr-2 rounded-full"
                />
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-xl shadow-md ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-green-300 text-black rounded-bl-none'
                }`}
              >
                {msg.content}
                <div className="text-sm mt-1 flex gap-2">
                  <span className="hover:scale-125 cursor-pointer">😄</span>
                  <span className="hover:scale-125 cursor-pointer">👍</span>
                  <span className="hover:scale-125 cursor-pointer">🤯</span>
                  <span className="hover:scale-125 cursor-pointer">❌</span>
                </div>
              </div>
            </div>
          ))}
          {loading && <p className="italic text-purple-300 animate-pulse">⌨️ Bot is typing...</p>}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <button
            onClick={handleClearChat}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:scale-105 transition px-4 py-2 text-white rounded-lg font-medium shadow-lg"
          >
            🧹 Clear Chat
          </button>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePDFUpload}
            className="file:px-4 file:py-2 file:bg-indigo-200 file:text-indigo-900 file:rounded-lg file:border-0 hover:file:bg-indigo-300 transition"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <input
            className="flex-grow px-4 py-3 border-2 border-purple-500 bg-[#2b2b3d] text-white rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="Ask me something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition px-6 py-3 rounded-xl text-white font-bold shadow-lg"
          >
            🚀 Send
          </button>
        </div>
      </div>
    </div>
  );
}

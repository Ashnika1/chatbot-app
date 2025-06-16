"use client";
import { useState } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMsg = { type: "user", text: newMessage };
    setMessages([...messages, userMsg]);
    setNewMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { type: "ai", text: data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { type: "ai", text: "⚠️ Failed to get response." }]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">💬 AI Chatbot</h1>
      <div className="h-96 overflow-y-auto border p-4 mb-4 rounded">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 text-left ${msg.type === "user" ? "text-blue-600" : "text-green-700"}`}>
            <span className="block p-2 rounded bg-gray-100">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Ask me anything..."
          className="flex-grow border rounded-l px-4 py-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="bg-blue-500 text-white px-4 rounded-r" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

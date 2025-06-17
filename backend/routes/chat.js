// backend/routes/chat.js

const axios = require('axios');
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// This is important: dotenv should be loaded once in server.js
// No need to load dotenv again here if already loaded in server.js

router.post('/', async (req, res) => {
  const { message } = req.body;
  const userEmail = req.user?.email;  // Get email from authenticated token

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    // Save user message to DB
    await Message.create({ email: userEmail, role: 'user', content: message });

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // You can change model here
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,  // ✅ Your API key from .env
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // ✅ For development
          'X-Title': 'YourAppName'  // Optional - better to give a title for OpenRouter policy
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // Save bot reply to DB
    await Message.create({ email: userEmail, role: 'bot', content: reply });

    res.json({ reply });
  } catch (error) {
    console.error('🔴 OpenRouter API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate response from OpenRouter' });
  }
});

// ✅ Get chat history for the logged-in user
router.get('/history', async (req, res) => {
  try {
    const messages = await Message.find({ email: req.user.email }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('❌ History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// ✅ Delete chat history
router.delete('/history', async (req, res) => {
  try {
    await Message.deleteMany({ email: req.user.email });
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    console.error('❌ History deletion error:', err);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});

module.exports = router;

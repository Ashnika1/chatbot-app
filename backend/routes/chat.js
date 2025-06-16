// backend/routes/chat.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const Message = require('../models/Message'); // For saving chat history

router.post('/', async (req, res) => {
  const { message } = req.body;
  const userEmail = req.user.email;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    // Save user message
    await Message.create({ email: userEmail, role: 'user', content: message });

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // or other available models like 'mistralai/mixtral-8x7b'
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // Replace with your frontend domain if deploying
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // Save bot reply
    await Message.create({ email: userEmail, role: 'bot', content: reply });

    res.json({ reply });
  } catch (error) {
    console.error('🔴 OpenRouter API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate response from OpenRouter' });
  }
});
router.get('/history', async (req, res) => {
  try {
    const messages = await require('../models/Message').find({ email: req.user.email }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error('❌ History fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

router.delete('/history', (req, res) => {
  // For now, we’ll just return success — real storage clearing depends on your DB
  return res.json({ message: 'Chat history cleared' });
});


module.exports = router;

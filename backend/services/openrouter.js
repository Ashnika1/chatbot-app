const axios = require('axios');

const sendMessageToAI = async (messages) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: messages,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message;
  } catch (error) {
    console.error(error.response.data || error.message);
    throw new Error('Failed to get AI response');
  }
};

module.exports = sendMessageToAI;

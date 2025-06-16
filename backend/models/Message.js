const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  email: String,
  role: String, // 'user' or 'bot'
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);

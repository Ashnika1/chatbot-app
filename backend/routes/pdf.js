// backend/routes/pdf.js or wherever you defined it

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const router = express.Router();

// 📁 Setup multer for file uploads
const storage = multer.memoryStorage(); // keep file in memory
const upload = multer({ storage });

// ✅ POST /api/pdf/upload
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const dataBuffer = req.file.buffer;
    const data = await pdfParse(dataBuffer);
    res.json({ text: data.text });
  } catch (error) {
    console.error('PDF parse error:', error);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
});

module.exports = router;

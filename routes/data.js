// server/routes/data.js
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Data = require('../models/Data');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Middleware to protect routes
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = decoded;
    next();
  });
};

router.post('/upload', authenticate, upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      await Data.insertMany(results);
      fs.unlinkSync(req.file.path); // Remove file after processing
      res.status(200).json({ message: 'Data uploaded successfully' });
    });
});

router.get('/data', authenticate, async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/data/:id', authenticate, async (req, res) => {
  try {
    await Data.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Generate the public URL for the uploaded image
  // In a real production app this might be an S3 URL, but locally it's served via Express static
  const imageUrl = `/uploads/${req.file.filename}`;
  
  res.status(200).json({ imageUrl });
});

module.exports = router;

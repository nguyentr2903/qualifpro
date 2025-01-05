const express = require('express');
const router = express.Router();

// Ensure the endpoint is authenticated if needed
router.get('/', (req, res) => {
  if (!req.user) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json({ apiKey: process.env.ORS_API_KEY });
});

module.exports = router;

const express = require("express");
const router = express.Router();
require("dotenv").config();
const ORS_API_KEY = process.env.ORS_API_KEY;

router.get("/", async (req, res) => {
    const { address } = req.query; 
    if (!address) {
      return res.status(400).send({ error: "Address is required" });
    }
  
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      res.json(data); // Send the geocoding data back to the client
    } catch (error) {
      console.error("Error fetching geocode data:", error);
      res.status(500).send({ error: "Failed to fetch geocode data" });
    }
  });

  module.exports = router;

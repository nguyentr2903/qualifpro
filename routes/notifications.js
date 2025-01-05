const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Update notification settings
router.post("/settings", async (req, res) => {
  try {
    const { userId, notified } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const task = await Task.findOne({ userId }); // Use userId from the request body
    if (task) {
      task.notified = notified;
      await task.save();
      res.status(200).json({ message: "Notification settings updated." });
    } else {
      res.status(404).json({ message: "Task not found." });
    }
  } catch (error) {
    console.error("Error updating notification settings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Fetch notification settings
router.get("/settings", async (req, res) => {
  try {
    const userId = req.query.userId; // Pass userId as a query parameter

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const task = await Task.findOne({ userId });
    if (task) {
      res.status(200).json({ notified: task.notified });
    } else {
      res.status(404).json({ message: "Task not found." });
    }
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;

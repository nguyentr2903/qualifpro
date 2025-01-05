const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Task and Goal Models
const Task = require("../models/Task");
const Goal = require("../models/Goal");
router.get("/", async (req, res) => {
    try {
      const tasksCompleted = await Task.countDocuments({ completed: true });
      const tasksTotal = await Task.countDocuments({});
      const goals = await Goal.find({}); // Fetch all goals
      const goalsTotal = goals.length;
  
      // Calculate goals completed and ensure `completed` field is accurate
      let goalsCompleted = 0;
  
      for (const goal of goals) {
        if (goal.progress === 100 && !goal.completed) {
          // Mark as completed if progress is 100%
          goal.completed = true;
          await goal.save();
        } else if (goal.progress < 100 && goal.completed) {
          // Unmark as completed if progress drops below 100%
          goal.completed = false;
          await goal.save();
        }
        if (goal.completed) {
          goalsCompleted++;
        }
      }
  
      // Calculate total progress for goals
      const goalsProgress = goals.reduce((total, goal) => total + (goal.progress || 0), 0);
  
      res.json({
        tasksCompleted,
        tasksTotal,
        goalsCompleted,
        goalsTotal,
        goalsProgress,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  


module.exports = router;

const express = require('express');
const Task = require('../models/Task');
const Goal = require('../models/Goal');
const router = express.Router();


// Combine tasks and goals into one endpoint
router.get('/', async (req, res) => {
  try {
    // Fetch tasks
    const tasks = await Task.find().lean();
    const taskEvents = tasks.map(task => ({
      title: task.title,
      due_date: task.due_date,
      description: task.description,
      type: 'task', // Add type for filtering
      location: task.task_location,
      priority: task.priority,
    }));

    // Fetch goals
    const goals = await Goal.find().lean();
    const goalEvents = goals.map(goal => ({
      title: goal.title,
      due_date: goal.due_date,
      description: goal.description,
      type: 'goal', // Add type for filtering
      location: goal.goal_location,
      priority: goal.priority,
    }));

    // Merge and return both tasks and goals
    const events = [...taskEvents, ...goalEvents];
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

module.exports = router;
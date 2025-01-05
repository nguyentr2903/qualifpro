const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { sendEmailNotification } = require('../emailService'); 
const { scheduleTaskNotifications } = require("../cronScheduler");

// GET /api/tasks - Fetch all tasks
router.get("/", async (req, res) => {
  try {
  
    const tasks = await Task.find();
  
    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET /api/tasks/:id - Fetch a single task
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error fetching task", error: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
 
  try {
    const {
      title,
      description = "",
      due_date = null,
      due_time = null,
      priority = " ",
      task_location = { address: null, latitude: null, longitude: null },
      user_email = null,
      reminder_frequency = null,
      notified,
    } = req.body; 

    const newTask = new Task({
      title,
      description: description || "",
      due_date: due_date || null, // Save as null if not provided
      due_time: due_time || null, // Save as null if not provided
      creation_date: new Date(),
      priority,
      task_location: {
    address: task_location?.address || null,
    latitude: parseFloat(task_location.latitude) || null,
    longitude: parseFloat(task_location.longitude) || null,
  },
  user_email: user_email || null,
      notified,
      reminder_frequency: reminder_frequency || null ,
   
  });
      // Send email if user_email is present
      if (user_email) {
    
        const emailSubject = `New Task Created: ${title}`;
        const emailBody = `
          Your task "${title}" has been successfully created.
  
          Details:
          - Description: ${description || "No description provided"}
          - Due Date and Time: ${due_date || "No due date"} ${due_time || ""}
          - Priority: ${priority || "No priority assigned"}
          - Location: ${task_location?.address || "No location provided"}
        `;
  
        try {
          await sendEmailNotification(user_email, emailSubject, emailBody);
          console.log(`Notification sent to ${user_email}`);
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError.message);
        }
     
      }
    await newTask.save();
    // Schedule task notification
    await scheduleTaskNotifications();
    res.status(201).json({ message: 'Task created successfully and notification sent.', task: newTask });
    console.log("Task created:", req.body);
   
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ message: 'Failed to create task.', error: error.message });
  }
 
});


router.put("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
   
    const updatedTask = await Task.findByIdAndUpdate(taskId,  req.body, { new: true });
    
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Mark task as completed
router.put("/:id/complete", async (req, res) => {
  try {
    const taskId = req.params.id;

    // Find the task and update its completed status
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = true; // Mark the task as completed
    await task.save();

    res.status(200).json({ message: "Task marked as complete", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to mark task as complete" });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task." });
  }
});
router.patch('/:id/notifications', async (req, res) => {
  try {
    const { id } = req.params;
    const { notified} = req.body;

    const task = await Task.findByIdAndUpdate(
      id,
      { notified },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json({ message: 'Notification settings updated.', task });
  } catch (error) {
    console.error('Error updating notification settings:', error.message);
    res.status(500).json({ message: 'Failed to update notification settings.', error: error.message });
  }
});

module.exports = router;

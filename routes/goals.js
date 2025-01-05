const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");
const { sendEmailNotification } = require('../emailService'); 
const { scheduleGoalNotifications } = require("../cronScheduler");
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json({ goals });
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// Create a new goal
router.post('/', async (req, res) => {
  try {
   
    const {
      title,
      description = "",
      due_date = null,
      due_time = null,
      priority = " ",
      goal_location = { address: null, latitude: null, longitude: null },
      user_email = null,
      reminder_frequency = null,
      subtasks,
      notified,
    } = req.body;
 
    // Create a new goal instance
    const newGoal = new Goal({
      title,
      description,
      creation_date: new Date(),
      due_date: due_date || null,
      due_time: due_time || null,
      goal_location: {
        address: goal_location?.address || null,
        latitude: parseFloat(goal_location.latitude) || null,
        longitude: parseFloat(goal_location.longitude) || null,
      }, 
      subtasks,
      priority, 
      user_email: user_email || null,
      reminder_frequency: reminder_frequency || null ,
      notified,
   
    });

    // Calculate progress
    newGoal.calculateProgress();
    if (user_email) {
     
        const emailSubject = `New Goal Created: ${title}`;
        const emailBody = `
          Your task "${title}" has been successfully created.
  
          Details:
          - Description: ${description || "No description provided"}
          - Due Date and Time: ${due_date || "No due date"}
          - Priority: ${priority || "No priority assigned"}
          - Location: ${goal_location?.address || "No location provided"}
        `;
  
        try {
          await sendEmailNotification(user_email, emailSubject, emailBody);
          console.log(`Notification sent to ${user_email}`);
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError.message);
        }
     
      }
    // Save to the database
    await newGoal.save();
        // Send email notification
        await scheduleGoalNotifications();
        res.status(201).json({ message: 'Goal created successfully and notification sent.', goal: newGoal });
      } catch (error) {
        console.error('Error creating goal:', error.message);
        res.status(500).json({ message: 'Failed to create goal.', error: error.message });
      }
      

});

// Update an existing goal
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedGoal = await Goal.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedGoal) {
      return res.status(404).json({ message: "Goal not found." });
    }

    res.status(200).json({ message: "Goal updated successfully.", goal: updatedGoal });
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Failed to update goal.", error: error.message });
  }
});

// Update the priority of a goal
router.put('/:id/priority', async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    console.log(goal.subtasks[index].completed);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Toggle priority
    goal.priority = goal.priority === 'high' ? 'medium' : 'high';

    await goal.save();
    res.status(200).json({ message: "Goal priority updated successfully", goal });
  } catch (err) {
    res.status(500).json({ message: "Failed to update goal priority", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedGoal = req.body;

  try {
    const goal = await Goal.findByIdAndUpdate(id, updatedGoal, { new: true });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    res.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    res.status(500).json({ message: "Failed to update goal" });
  }
});
router.put("/:id/favorite", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Toggle the favorite status
    goal.favorite = !goal.favorite;
    await goal.save();

    res.json({ favorite: goal.favorite });
  } catch (error) {
    console.error("Error updating favorite status:", error);
    res.status(500).json({ message: "Failed to update favorite status" });
  }
});


router.put("/:goalId/subtasks/:index", async (req, res) => {
  const { goalId, index } = req.params;
  const { completed } = req.body;
  const goal = await Goal.findById(goalId);
  console.log(goal.subtasks[index].completed);
  try {
    
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // Update the subtask completion status
    if (goal.subtasks && goal.subtasks[index]) {
      goal.subtasks[index].completed = completed;

      // Optionally, recalculate progress
      const totalSubtasks = goal.subtasks.length;
      const completedSubtasks = goal.subtasks.filter((subtask) => subtask.completed).length;
      goal.progress = Math.round((completedSubtasks / totalSubtasks) * 100);

      await goal.save();
      return res.json({ progress: goal.progress, goal });
    }

    return res.status(404).json({ message: "Subtask not found" });
  } catch (error) {
    console.error("Error updating subtask:", error);
    res.status(500).json({ message: "Failed to update subtask" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGoal = await Goal.findByIdAndDelete(id);

    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting goal:", error);
    res.status(500).json({ message: "Failed to delete goal" });
  }
});


module.exports = router;

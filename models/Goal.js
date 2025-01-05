// models/Goal.js
const mongoose = require('mongoose');

// Define subtask schema
const subtaskSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Name of the subtask
  completed: { type: Boolean, default: false },  // Whether the subtask is completed
  
});

// Define goal schema
const goalSchema = new mongoose.Schema({ 
  title: { type: String, required: true },  // Title of the goal
  description: { type: String, default: "" }, // Description of the goal
  due_date: { type: Date, default: null },  // Due date of the goal
  due_time: { type: String, default: null }, //Due time of the goal
  creation_date: { type: Date, default: null }, // Creation date
  favorite: { type: Boolean, default: false },
  goal_location: {
    address: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  subtasks: [subtaskSchema],  // List of subtasks under the goal
  created_at: { type: Date, default: Date.now },  // Timestamp when the goal was created
  updated_at: { type: Date, default: Date.now },  // Timestamp when the goal was last updated
  progress: { type: Number, default: 0 },  // Progress percentage of goal completion
  priority: { type: String, default: " " },  // Priority level of the goal
  completed: { type: Boolean, default: false },
  user_email: { type: String,  default: null  },
  reminder_frequency: { type: Number, default: null }, // Null for "Don't Remind"
  notified: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
});

// Middleware to update the `updated_at` field before saving
goalSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Calculate progress automatically based on subtasks
goalSchema.methods.calculateProgress = function () {
  if (this.subtasks && this.subtasks.length > 0) {
    const completedSubtasks = this.subtasks.filter(subtask => subtask.completed).length;
    this.progress = Math.round((completedSubtasks / this.subtasks.length) * 100);
  } else {
    this.progress = 0;
  }
};

goalSchema.methods.setPriorityHigh = function () {
  this.priority = 'high';
};


module.exports = mongoose.model('Goal', goalSchema);

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  due_date: { type: Date, default: null },
  due_time: { type: String, default: null },
  priority: { type: String, default: "unspecified" },
  task_location: {
    address: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  user_email: { type: String, default: null },
  reminder_frequency: { type: Number, default: null }, // Null for "Don't Remind"
  creation_date: { type: Date, default: Date.now },
  notified: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', TaskSchema);

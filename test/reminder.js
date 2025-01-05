class Reminder {
  constructor() {
    this.reminders = [];
    this.currentTime = () => new Date(); // Allows mocking in tests
  }

  validateDateTime(date, time) {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error('Invalid date format');
    }
    if (time && !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
      throw new Error('Invalid time format');
    }

    const now = this.currentTime();
    const reminderDate = new Date(`${date}T${time || '00:00'}`);
    if (reminderDate < now) {
      throw new Error('Reminder date and time cannot be in the past');
    }
  }

  createReminder(taskId, message, date, time = null, email = null, completed = false) {
    if (!Number.isInteger(taskId)) {
      throw new Error('Task ID must be a valid number');
    }
    if (!email) {
      throw new Error('Email is required');
    }

    this.validateDateTime(date, time);

    const id = this.reminders.length + 1;
    const reminder = {
      id,
      taskId,
      message,
      date,
      time,
      email,
      completed,
    };

    this.reminders.push(reminder);
    return reminder;
  }

  markReminderCompleted(reminderId) {
    const reminder = this.reminders.find((r) => r.id === reminderId);
    if (!reminder) {
      throw new Error('Reminder not found');
    }
    reminder.completed = true;
    return reminder;
  }

  getReminders(taskId) {
    if (!Number.isInteger(taskId)) {
      throw new Error('Task ID must be a valid number');
    }
    return this.reminders.filter((reminder) => reminder.taskId === taskId);
  }
}

module.exports = Reminder;

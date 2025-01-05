const cron = require("node-cron");
const Task = require("./models/Task");
const Goal = require("./models/Goal");
const { sendEmailNotification } = require("./emailService");

// Global scheduler map to track active cron jobs
const cronTaskSchedulers = {};
const cronGoalSchedulers = {};
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
  if (!emailRegex.test(email)) {
    return false;
  }

  // Extract domain from email
  const domain = email.split("@")[1];
  if (!domain) {
    return false;
  }

  // Check for valid domain and TLD
  const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]; // Extend this list as needed
  const tldRegex = /\.(com|org|net|edu|gov|io|co)$/i; // Common valid TLDs

  if (!validDomains.includes(domain) && !tldRegex.test(domain)) {
    console.warn(`Invalid email domain detected: ${domain}`);
    return false;
  }

  return true;
}


async function scheduleTaskNotifications() {
  console.log("Initializing task notification scheduler...");

  const now = new Date();
  console.log(`Current Time: ${now.toISOString()}`);

  try {
    // Fetch all tasks with notifications pending
    const tasks = await Task.find({ notified: false });

    console.log(`Found ${tasks.length} task(s) for scheduling.`);

    for (const task of tasks) {
      if (!task.due_time) {
        console.warn(`Task "${task.title}" is missing due_time. Skipping.`);
        continue;
      }
      if (task.completed == true) {
        console.log(`Task "${task.title}" is already completed. Skipping notification.`);
        continue;
      }

      if (task.reminder_frequency == null || task.reminder_frequency === 0) {
        console.log(`No reminders scheduled for task "${task.title}" as reminder frequency is null or 0.`);
        continue;
      }
      if (!task.user_email || !validateEmail(task.user_email)) {
        console.warn(`Task "${task.title}" has an invalid or missing email address. Skipping notification.`);
        continue;
      }

      const dueDate = new Date(task.due_date);
      const [hours, minutes] = task.due_time.split(":").map(Number);
      dueDate.setHours(hours, minutes, 0, 0);

      if (isNaN(dueDate.getTime())) {
        console.error(`Task "${task.title}" has invalid combined due date and time. Skipping.`);
        continue;
      }

      // Get the reminder frequency for this task
      const reminderFrequency = task.reminder_frequency; // Default to 24 hours if not specified

      // Convert reminder frequency to cron format (minutes granularity for testing)
      const cronInterval = `*/${reminderFrequency * 1} * * * *`;

      if (cronTaskSchedulers[task._id]) {
        console.log(`Updating existing schedule for task "${task.title}".`);
        cronTaskSchedulers[task._id].stop();
      }

      console.log(`Scheduling task "${task.title}" every ${reminderFrequency} hours(s)...`);

      // Create the cron job for the specific reminder frequency
      cronTaskSchedulers[task._id] = cron.schedule(cronInterval, async () => {
        const now = new Date();
        const timeRemaining = dueDate - now;

        // Send notification if within the reminder window
        if (timeRemaining > 0 && timeRemaining <= reminderFrequency * 60 * 60 * 1000) {
          console.log(`Sending notification for task "${task.title}"...`);

          const subject = `Reminder: Task "${task.title}" is Due Soon`;
          const body = `
            Hello,

            Your task "${task.title}" is due on ${task.due_date} at ${task.due_time}.

            Details:
            - Priority: ${task.priority || "No priority assigned"}
            - Description: ${task.description || "No description provided"}
            - Location: ${task.task_location?.address || "No location provided"}
            You set the reminder for ${reminderFrequency} hour(s).
            Best regards,
            Your Task Manager
          `;

          try {
            await sendEmailNotification(task.user_email, subject, body);
            console.log(`Notification sent to ${task.user_email} for task "${task.title}".`);

            // Mark task as notified only after successful email
            task.notified = true;
            await task.save();
            console.log(`Task "${task.title}" marked as notified.`);

            // Stop the cron job for this task
            cronTaskSchedulers[task._id].stop();
            delete cronTaskSchedulers[task._id];
          } catch (emailError) {
            console.error(`Error sending email for task "${task.title}":`, emailError.message);
          }
        } else if (timeRemaining <= 0) {
          console.log(`Task "${task.title}" is overdue. Sending final notification and stopping reminders.`);
            // Send overdue notification
  const overdueSubject = `Overdue: Task "${task.title}" Has Passed Its Deadline`;
  const overdueBody = `
    Hello,

    Your task "${task.title}" was due on ${task.due_date} at ${task.due_time} and is now overdue.

    Please review your task list and update the status as needed.

    Best regards,
    Your Task Manager
  `;

  try {
    await sendEmailNotification(task.user_email, overdueSubject, overdueBody);
    console.log(`Overdue notification sent to ${task.user_email} for task "${task.title}".`);
  } catch (emailError) {
    console.error(`Error sending overdue email for task "${task.title}":`, emailError.message);
  }
          cronTaskSchedulers[task._id].stop();
          delete cronTaskSchedulers[task._id];
        }
      });
    }
  } catch (error) {
    console.error("Error fetching tasks for notifications:", error.message);
  }
}

async function scheduleGoalNotifications() {
  console.log("Initializing goal notification scheduler...");

  const now = new Date();
  console.log(`Current Time: ${now.toISOString()}`);

  try {
    // Fetch all incomplete goals with notifications pending
    const goals = await Goal.find({ completed: false });

    console.log(`Found ${goals.length} goal(s) for scheduling.`);

    for (const goal of goals) {
      if (!goal.due_date) {
        console.warn(`Task "${goal.title}" is missing due_date. Skipping.`);
        continue;
      }
      if (goal.completed == true) {
        console.log(`Task "${goal.title}" is already completed. Skipping notification.`);
        continue;
      }

      if (goal.reminder_frequency == null || goal.reminder_frequency === 0) {
        console.log(`No reminders scheduled for task "${task.title}" as reminder frequency is null or 0.`);
        continue;
      }
      if (!goal.user_email || !validateEmail(goal.user_email)) {
        console.warn(`Task "${task.title}" has an invalid or missing email address. Skipping notification.`);
        continue;
      }

      const dueDate = new Date(goal.due_date);
      if (goal.due_time) {
        const [hours, minutes] = goal.due_time.split(":").map(Number);
        dueDate.setHours(hours, minutes, 0, 0);
      }

      if (isNaN(dueDate.getTime())) {
        console.error(`Goal "${goal.title}" has an invalid due date or time. Skipping.`);
        alert("You have not added time or date. Reminders are skipped");
        continue;
      }

      const reminderFrequency = goal.reminder_frequency; // Default to 24 hours if not specified

      const cronInterval = `*/${reminderFrequency * 60} * * * *`; // For testing, change interval logic as needed

      if (cronGoalSchedulers[goal._id]) {
        console.log(`Updating existing schedule for goal "${goal.title}".`);
        cronGoalSchedulers[goal._id].stop();
      }

      console.log(`Scheduling goal "${goal.title}" every ${reminderFrequency} hour(s)...`);

      cronGoalSchedulers[goal._id] = cron.schedule(cronInterval, async () => {
        const now = new Date();
        const timeRemaining = dueDate - now;

        if (timeRemaining > 0 && timeRemaining <= reminderFrequency * 60 * 60 * 1000) {
          console.log(`Sending notification for goal "${goal.title}"...`);

          const subject = `Reminder: Goal "${goal.title}" is Approaching Deadline`;
          const body = `
            Hello,

            Your goal "${goal.title}" is due on ${goal.due_date.toDateString()} at ${
            goal.due_time || "unspecified time"
          }.

            Details:
            - Priority: ${goal.priority || "No priority assigned"}
            - Progress: ${goal.progress}% (${goal.subtasks.filter(st => st.completed).length}/${goal.subtasks.length} subtasks completed)
            - Location: ${goal.goal_location?.address || "No location provided"}
            - Description: ${goal.description || "No description provided"}

            Best regards,
            Your Goal Manager
          `;

          try {
            await sendEmailNotification(goal.user_email, subject, body);
            console.log(`Notification sent to ${goal.user_email} for goal "${goal.title}".`);
          } catch (emailError) {
            console.error(`Error sending email for goal "${goal.title}":`, emailError.message);
          }
        } else if (timeRemaining <= 0) {
          console.log(`Goal "${goal.title}" is overdue. No further notifications.`);
          const overdueSubject = `Overdue: Task "${goal.title}" Has Passed Its Deadline`;
  const overdueBody = `
    Hello,

    Your task "${goal.title}" was due on ${goal.due_date} at ${goal.due_time} and is now overdue.

    Please review your task list and update the status as needed.

    Best regards,
    Your Task Manager
  `;
  try {
    await sendEmailNotification(goal.user_email, overdueSubject, overdueBody);
    console.log(`Overdue notification sent to ${goal.user_email} for task "${goal.title}".`);
  } catch (emailError) {
    console.error(`Error sending overdue email for task "${goal.title}":`, emailError.message);
  }
          cronGoalSchedulers[goal._id].stop();
          delete cronGoalSchedulers[goal._id];
        }
      });
    }
  } catch (error) {
    console.error("Error scheduling goal notifications:", error.message);
  }
}


module.exports = { scheduleTaskNotifications, scheduleGoalNotifications };

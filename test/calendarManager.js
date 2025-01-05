class CalendarManager {
    constructor(tasks, goals) {
      this.tasks = tasks;
      this.goals = goals;
    }
  
    filterEvents(filter = 'all') {
   
  
      let events = [];
      if (filter === 'all' || filter === 'task') {
        events = events.concat(
          this.tasks.map((task) => ({
            type: 'task',
            title: task.title,
            start: task.dueDate,
            priority: task.priority,
            location: task.location,
          }))
        );
      }
  
      if (filter === 'all' || filter === 'goal') {
        events = events.concat(
          this.goals.map((goal) => ({
            type: 'goal',
            title: goal.title,
            start: goal.dueDate,
            progress: goal.progress,
          }))
        );
      }
  
      return events;
    }
  }
  
  module.exports = CalendarManager;
  
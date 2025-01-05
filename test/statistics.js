class Statistics {
    constructor(tasks = [], goals = []) {
      this.tasks = tasks;
      this.goals = goals;
    }
  
    calculateCompletionStatistics() {
      const totalTasks = this.tasks.length;
      const totalGoals = this.goals.length;
  
      const completedTasks = this.tasks.filter((task) => task.completed).length;
      const completedGoals = this.goals.filter((goal) => goal.completed).length;
  
      const taskCompletionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
      const goalCompletionRate = totalGoals ? (completedGoals / totalGoals) * 100 : 0;
  
      return {
        totalTasks,
        totalGoals,
        completedTasks,
        completedGoals,
        taskCompletionRate: parseFloat(taskCompletionRate.toFixed(2)),
        goalCompletionRate: parseFloat(goalCompletionRate.toFixed(2)),
      };
    }
  }
  
  module.exports = Statistics;
  
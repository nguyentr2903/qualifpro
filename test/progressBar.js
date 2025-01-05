class ProgressBar {
  calculateGoalProgress(goal) {
    if (!goal || !goal.subtasks || !Array.isArray(goal.subtasks)) {
      throw new Error('Invalid goal or subtasks');
    }

    const totalSubtasks = goal.subtasks.length;
    const completedSubtasks = goal.subtasks.filter((subtask) => subtask.completed).length;

    return totalSubtasks ? parseFloat(((completedSubtasks / totalSubtasks) * 100).toFixed(2)) : 0;
  }
}

module.exports = ProgressBar;

const Statistics = require('./statistics');

describe('Statistics', () => {
  let tasks, goals, statistics;

  beforeEach(() => {
    tasks = [
      { completed: true },
      { completed: false },
      { completed: true },
    ];
    goals = [
      { completed: true },
      { completed: false },
    ];
    statistics = new Statistics(tasks, goals);
  });

  test('calculates completion statistics correctly', () => {
    const result = statistics.calculateCompletionStatistics();
    expect(result).toEqual({
      totalTasks: 3,
      totalGoals: 2,
      completedTasks: 2,
      completedGoals: 1,
      taskCompletionRate: 66.67,
      goalCompletionRate: 50.0,
    });
  });

  test('handles empty tasks and goals', () => {
    statistics = new Statistics([], []);
    const result = statistics.calculateCompletionStatistics();
    expect(result).toEqual({
      totalTasks: 0,
      totalGoals: 0,
      completedTasks: 0,
      completedGoals: 0,
      taskCompletionRate: 0,
      goalCompletionRate: 0,
    });
  });
});

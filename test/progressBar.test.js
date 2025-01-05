const ProgressBar = require('./progressBar');

describe('ProgressBar', () => {
  let progressBar;

  beforeEach(() => {
    progressBar = new ProgressBar();
  });

  test('calculates progress correctly', () => {
    const goal = {
      subtasks: [
        { completed: true },
        { completed: false },
        { completed: true },
      ],
    };

    const progress = progressBar.calculateGoalProgress(goal);
    expect(progress).toBe(66.67);
  });

  test('returns 0 progress for empty subtasks', () => {
    const goal = { subtasks: [] };
    const progress = progressBar.calculateGoalProgress(goal);
    expect(progress).toBe(0);
  });

  test('throws an error for invalid goal', () => {
    expect(() => progressBar.calculateGoalProgress(null)).toThrow('Invalid goal or subtasks');
    expect(() => progressBar.calculateGoalProgress({})).toThrow('Invalid goal or subtasks');
  });
});

const TaskManager = require('./taskManager'); // Adjust the path as needed

describe('TaskManager - Get Tasks', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();

    // Set up tasks
    taskManager.createTask('Task 1', 'Description 1', '2025-01-01', '10:00', 'Location 1', 'test1@example.com');
    taskManager.createTask('Task 2', 'Description 2', '2025-01-02', '11:00', 'Location 2', 'test2@example.com');
  });

  test('returns all tasks', () => {
    const tasks = taskManager.getTasks();

    // Assertions
    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe('Task 1');
    expect(tasks[1].title).toBe('Task 2');
  });

  test('returns an empty array if no tasks exist', () => {
    const emptyTaskManager = new TaskManager(); // New instance with no tasks
    const tasks = emptyTaskManager.getTasks();

    // Assertions
    expect(tasks).toHaveLength(0);
    expect(tasks).toEqual([]);
  });

  test('does not include goals in the task list', () => {
    taskManager.createTask('Goal 1', 'Goal Description', '2025-01-03', '12:00', 'Goal Location', 'goal@example.com', [
      { name: 'Subtask 1', completed: false },
    ]);

    const tasks = taskManager.getTasks();

    // Assertions
    expect(tasks).toHaveLength(2); // Only tasks, no goals
    expect(tasks.some((task) => task.title === 'Goal 1')).toBe(false);
  });
});

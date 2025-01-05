const TaskManager = require('./taskManager');

describe('TaskManager - Validate Task/Goal Deletion', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  test('deletes an existing task', () => {
    const task = taskManager.createTask('Sample Task', 'Description', '2025-01-01', '12:00', 'Location');
    const result = taskManager.deleteItem(task.id);

    expect(result.type).toBe('task');
    expect(result.deleted).toEqual(task);
    expect(taskManager.getTasks().length).toBe(0);
  });

  test('deletes an existing goal', () => {
    const subtasks = [{ name: 'Subtask 1', completed: false }];
    const goal = taskManager.createTask('Goal with Subtasks', '', '2025-01-01', '10:00', 'Location', '', subtasks);
    const result = taskManager.deleteItem(goal.id);

    expect(result.type).toBe('goal');
    expect(result.deleted).toEqual(goal);
    expect(taskManager.getGoals().length).toBe(0);
  });

  test('throws an error when deleting a non-existent task or goal', () => {
    expect(() => taskManager.deleteItem(999)).toThrowError('Task or Goal with ID 999 not found');
  });

  test('throws an error when deleting with a malformed ID', () => {
    expect(() => taskManager.deleteItem(null)).toThrowError('Task or Goal with ID null not found');
  });
});

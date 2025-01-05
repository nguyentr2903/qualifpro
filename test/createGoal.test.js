const TaskManager = require('./taskManager');

describe('TaskManager - Create Task', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });


  test('throws an error for invalid dueDate format', () => {
    expect(() => {
      taskManager.createTask('Task with Invalid Date', '', 'invalid-date');
    }).toThrowError('Invalid dueDate format');
  });

  test('throws an error for invalid dueTime format', () => {
    expect(() => {
      taskManager.createTask('Task with Invalid Time', '', '2025-01-01', 'invalid-time');
    }).toThrowError('Invalid dueTime format');
  });
});

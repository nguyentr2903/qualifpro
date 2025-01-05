const TaskManager = require('./taskManager'); // Adjust the path as necessary

describe('TaskManager - Validate Invalid Data in Fields', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager(); // Initialize a new TaskManager instance before each test
  });



  test('throws an error when dueDate is not a valid date format', () => {
    expect(() => {
      taskManager.createTask('Sample Task', 'Sample description', 'invalid-date', '12:00', 'Sample Location', 'test@example.com');
    }).toThrowError('Invalid dueDate format');
  });

  test('throws an error when dueTime is not a valid time format', () => {
    expect(() => {
      taskManager.createTask('Sample Task', 'Sample description', '2025-01-01', 'invalid-time', 'Sample Location', 'test@example.com');
    }).toThrowError('Invalid dueTime format');
  });

  test('throws an error when email is not valid', () => {
    expect(() => {
      taskManager.createTask('Sample Task', 'Sample description', '2025-01-01', '12:00', 'Sample Location', 'test@');
    }).toThrowError('Invalid email address');
  });

  test('allows undefined optional fields', () => {
    const task = taskManager.createTask('Sample Task');
    expect(task).toEqual({
      id: 1,
      title: 'Sample Task',
      description: '',
      dueDate: undefined,
      dueTime: undefined,
      location: undefined,
      email: undefined,
      completed: false,
    });
  });
});

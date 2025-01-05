const TaskManager = require('./taskManager'); // Adjust the path as necessary

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager(); // Initialize a new TaskManager instance before each test
  });

  test('throws an error when title is missing', () => {
    expect(() => {
      taskManager.createTask('', 'Sample description', '2025-01-01', '12:00', 'Sample Location', 'test@example.com');
    }).toThrowError('Title is required');
  });

  test('creates a task when all required fields are provided', () => {
    const task = taskManager.createTask('Sample Task', 'Sample description', '2025-01-01', '12:00', 'Sample Location', 'test@example.com');

    expect(task).toEqual({
      id: 1,
      title: 'Sample Task',
      description: 'Sample description',
      dueDate: '2025-01-01',
      dueTime: '12:00',
      location: 'Sample Location',
      email: 'test@example.com',
      completed: false,
    });

    expect(taskManager.tasks.length).toBe(1);
  });

  test('creates a task with optional fields left undefined', () => {
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

    expect(taskManager.tasks.length).toBe(1);
  });

  test('increments task ID for each new task', () => {
    const task1 = taskManager.createTask('Task 1');
    const task2 = taskManager.createTask('Task 2');

    expect(task1.id).toBe(1);
    expect(task2.id).toBe(2);
  });
});

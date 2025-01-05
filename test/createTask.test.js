const TaskManager = require('./taskManager');

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  test('should create a task with valid inputs, even without dueTime', () => {
    const task = taskManager.createTask('Test Task', 'Description');

    expect(task).toMatchObject({
      id: 1,
      title: 'Test Task',
      description: 'Description',
      dueTime: undefined,
      dueDate: undefined,
      location: undefined,
      email: undefined,
      completed: false,
    });

    expect(taskManager.tasks.length).toBe(1);
  });

  test('should create a task without dueDate', () => {
    const task = taskManager.createTask('Test Task', 'Description', null, '12:00');

    expect(task).toMatchObject({
      id: 1,
      title: 'Test Task',
      description: 'Description',
      dueTime: '12:00',
      dueDate: undefined,
      location: undefined,
      email: undefined,
      completed: false,
    });
  });

  test('should create a task without location', () => {
    const task = taskManager.createTask('Test Task', 'Description', '2025-01-01', '12:00', null);

    expect(task).toMatchObject({
      id: 1,
      title: 'Test Task',
      description: 'Description',
      dueTime: '12:00',
      dueDate: '2025-01-01',
      location: undefined,
      email: undefined,
      completed: false,
    });
  });

  test('should create a task without email', () => {
    const task = taskManager.createTask(
      'Test Task',
      'Description',
      '2025-01-01',
      '12:00',
      'Office',
      null
    );

    expect(task).toMatchObject({
      id: 1,
      title: 'Test Task',
      description: 'Description',
      dueTime: '12:00',
      dueDate: '2025-01-01',
      location: 'Office',
      email: undefined,
      completed: false,
    });
  });

  test('should create a task when only title is provided', () => {
    const task = taskManager.createTask('Test Task');

    expect(task).toMatchObject({
      id: 1,
      title: 'Test Task',
      description: '',
      dueTime: undefined,
      dueDate: undefined,
      location: undefined,
      email: undefined,
      completed: false,
    });
  });
});

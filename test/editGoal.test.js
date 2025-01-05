const TaskManager = require('./taskManager'); // Adjust the path as needed

describe('TaskManager - Edit Goal', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();

    // Create a goal
    taskManager.createTask('Goal 1', 'Goal Description', '2025-01-01', '10:00', 'Goal Location', 'goal@example.com', [
      { name: 'Subtask 1', completed: false },
      { name: 'Subtask 2', completed: true },
    ]);
  });

  test('edits an existing goal', () => {
    const goalId = 1;

    const updatedGoal = taskManager.editTask(goalId, {
      title: 'Updated Goal 1',
      description: 'Updated Goal Description',
      dueDate: '2025-01-02',
      dueTime: '11:00',
      location: 'Updated Goal Location',
      email: 'updated@example.com',
    });

    // Assertions
    expect(updatedGoal.title).toBe('Updated Goal 1');
    expect(updatedGoal.description).toBe('Updated Goal Description');
    expect(updatedGoal.dueDate).toBe('2025-01-02');
    expect(updatedGoal.dueTime).toBe('11:00');
    expect(updatedGoal.location).toBe('Updated Goal Location');
    expect(updatedGoal.email).toBe('updated@example.com');
  });

  test('updates subtasks in a goal', () => {
    const goalId = 1;

    const updatedGoal = taskManager.editTask(goalId, {
      subtasks: [
        { name: 'Subtask 1', completed: true },
        { name: 'Subtask 3', completed: false },
      ],
    });

    // Assertions
    expect(updatedGoal.subtasks).toHaveLength(2);
    expect(updatedGoal.subtasks[0].name).toBe('Subtask 1');
    expect(updatedGoal.subtasks[0].completed).toBe(true);
    expect(updatedGoal.subtasks[1].name).toBe('Subtask 3');
    expect(updatedGoal.subtasks[1].completed).toBe(false);
  });

  test('throws an error if goal ID does not exist', () => {
    expect(() => taskManager.editTask(999, { title: 'Non-existent Goal' })).toThrowError(
      'Task or Goal with ID 999 not found'
    );
  });

  test('throws an error for invalid dueDate format', () => {
    expect(() =>
      taskManager.editTask(1, { dueDate: 'invalid-date' })
    ).toThrowError('Invalid dueDate format');
  });

  test('throws an error for invalid dueTime format', () => {
    expect(() =>
      taskManager.editTask(1, { dueTime: 'invalid-time' })
    ).toThrowError('Invalid dueTime format');
  });

  test('throws an error for invalid email format', () => {
    expect(() =>
      taskManager.editTask(1, { email: 'invalid-email' })
    ).toThrowError('Invalid email address');
  });

  test('throws an error if title is missing', () => {
    expect(() => taskManager.editTask(1, { title: '' })).toThrowError('Title is required');
  });
});

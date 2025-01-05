const TaskManager = require('./taskManager');

describe('TaskManager - Delete of a Non-existent Task/Goal', () => {
  let taskManager;

  beforeEach(() => {
    taskManager = new TaskManager();
  });

  test('throws an error when deleting a non-existent task or goal by valid ID', () => {
    const nonExistentId = 100; // An arbitrary ID that doesn't exist
    expect(() => taskManager.deleteItem(nonExistentId)).toThrowError(
      `Task or Goal with ID ${nonExistentId} not found`
    );
  });

  test('throws an error when deleting a non-existent task or goal by invalid ID', () => {
    const invalidId = null; // Invalid ID
    expect(() => taskManager.deleteItem(invalidId)).toThrowError(
      `Task or Goal with ID ${invalidId} not found`
    );
  });

  test('throws an error when deleting from an empty list of tasks and goals', () => {
    expect(taskManager.getTasks().length).toBe(0);
    expect(taskManager.getGoals().length).toBe(0);

    expect(() => taskManager.deleteItem(1)).toThrowError(`Task or Goal with ID 1 not found`);
  });
});

const TaskManager = require('./taskManager');

describe('TaskManager - Edit Task/Goal', () => {
    let taskManager;
  
    beforeEach(() => {
        taskManager = new TaskManager();
        taskManager.createTask('Task 1', 'Description 1', '2025-01-01', '10:00', 'Location 1', 'test1@example.com');
        taskManager.createTask('Goal 1', 'Description 2', '2025-01-02', '12:00', 'Location 2', 'test2@example.com', [
          { name: 'Subtask 1', completed: false },
        ]);
      });
  
      test('throws an error for invalid dueDate format', () => {
        expect(() => taskManager.editTask(1, { dueDate: 'invalid-date' })).toThrowError('Invalid dueDate format');
      });
      
      test('throws an error for invalid dueTime format', () => {
        expect(() => taskManager.editTask(1, { dueTime: 'invalid-time' })).toThrowError('Invalid dueTime format');
      });
      
      test('throws an error for invalid email format', () => {
        expect(() => taskManager.editTask(1, { email: 'invalid-email' })).toThrowError('Invalid email address');
      });
      
      test('throws an error for missing title', () => {
        expect(() => taskManager.editTask(1, { title: '' })).toThrowError('Title is required');
      });
      

      
    
      
  });
const Reminder = require('./reminder');

describe('Reminder - Additional Scenarios', () => {
  let reminder;

  beforeEach(() => {
    reminder = new Reminder();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('throws an error for overdue date and time', () => {
    jest.spyOn(reminder, 'currentTime').mockReturnValue(new Date('2025-01-01T12:00:00'));
    expect(() =>
      reminder.createReminder(1, 'Overdue Reminder', '2025-01-01', '11:59', 'test@example.com')
    ).toThrow('Reminder date and time cannot be in the past');
  });

  test('throws an error when email is not provided', () => {
    jest.spyOn(reminder, 'currentTime').mockReturnValue(new Date('2025-01-01T12:00:00'));
    expect(() =>
      reminder.createReminder(1, 'No Email Reminder', '2025-01-02', '12:30')
    ).toThrow('Email is required');
  });

  test('marks a reminder as completed', () => {
    jest.spyOn(reminder, 'currentTime').mockReturnValue(new Date('2025-01-01T12:00:00'));
    const createdReminder = reminder.createReminder(
      1,
      'Complete this task',
      '2025-01-02',
      '12:30',
      'test@example.com'
    );

    const completedReminder = reminder.markReminderCompleted(createdReminder.id);

    expect(completedReminder.completed).toBe(true);
  });

  test('throws an error when marking a non-existent reminder as completed', () => {
    expect(() => reminder.markReminderCompleted(999)).toThrow('Reminder not found');
  });

  test('creates a valid reminder with date and time', () => {
    jest.spyOn(reminder, 'currentTime').mockReturnValue(new Date('2025-01-01T12:00:00'));
    const result = reminder.createReminder(
      1,
      'Valid Reminder',
      '2025-01-02',
      '14:30',
      'test@example.com'
    );

    expect(result).toEqual({
      id: 1,
      taskId: 1,
      message: 'Valid Reminder',
      date: '2025-01-02',
      time: '14:30',
      email: 'test@example.com',
      completed: false,
    });
  });
});

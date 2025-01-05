const CalendarManager = require('./calendarManager');

describe('CalendarManager - Filter Events', () => {
  let calendarManager;

  const sampleTasks = [
    { title: 'Task 1', dueDate: '2025-01-05', priority: 'high', location: 'Office' },
    { title: 'Task 2', dueDate: '2025-01-06', priority: 'medium', location: 'Home' },
  ];

  const sampleGoals = [
    { title: 'Goal 1', dueDate: '2025-01-07', progress: 50 },
    { title: 'Goal 2', dueDate: '2025-01-08', progress: 80 },
  ];

  beforeEach(() => {
    calendarManager = new CalendarManager(sampleTasks, sampleGoals);
  });

  test('returns all events when filter is "all"', () => {
    const events = calendarManager.filterEvents('all');
    expect(events).toHaveLength(4);
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'task', title: 'Task 1' }),
        expect.objectContaining({ type: 'task', title: 'Task 2' }),
        expect.objectContaining({ type: 'goal', title: 'Goal 1' }),
        expect.objectContaining({ type: 'goal', title: 'Goal 2' }),
      ])
    );
  });

  test('returns only tasks when filter is "task"', () => {
    const events = calendarManager.filterEvents('task');
    expect(events).toHaveLength(2);
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'task', title: 'Task 1' }),
        expect.objectContaining({ type: 'task', title: 'Task 2' }),
      ])
    );
  });

  test('returns only goals when filter is "goal"', () => {
    const events = calendarManager.filterEvents('goal');
    expect(events).toHaveLength(2);
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'goal', title: 'Goal 1' }),
        expect.objectContaining({ type: 'goal', title: 'Goal 2' }),
      ])
    );
  });

  test('returns an empty array if no tasks or goals exist', () => {
    const emptyManager = new CalendarManager([], []);
    expect(emptyManager.filterEvents('all')).toEqual([]);
    expect(emptyManager.filterEvents('task')).toEqual([]);
    expect(emptyManager.filterEvents('goal')).toEqual([]);
  });
});

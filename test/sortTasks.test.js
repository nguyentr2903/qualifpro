const sortTasksByDistance = require('./sortTasks');
const calculateDistance = require('./calculateDistance');

// Mock calculateDistance
jest.mock('./calculateDistance', () => jest.fn());

describe('sortTasksByDistance', () => {
  const userCoords = { lat: 40.7128, lon: -74.006 }; // NYC coordinates

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('sorts tasks by proximity', () => {
    // Mock calculateDistance implementation
    calculateDistance.mockImplementation((lat1, lon1, lat2, lon2) => {
      if (lat2 === 40.7128 && lon2 === -74.006) return 0; // Same as user's location
      if (lat2 === 34.0522 && lon2 === -118.2437) return 3935.75; // Distance to LA
      if (lat2 === 41.8781 && lon2 === -87.6298) return 1144.88; // Distance to Chicago
      return Infinity; // Default
    });

    const tasks = [
      { title: 'Task 1', task_location: { latitude: 40.7128, longitude: -74.006 } },
      { title: 'Task 2', task_location: { latitude: 34.0522, longitude: -118.2437 } },
      { title: 'Task 3', task_location: { latitude: 41.8781, longitude: -87.6298 } },
    ];

    const sortedTasks = sortTasksByDistance(tasks, userCoords);

    expect(sortedTasks.map((task) => task.title)).toEqual(['Task 1', 'Task 3', 'Task 2']); // NYC -> Chicago -> LA
  });

  test('assigns Infinity to tasks without valid location', () => {
    const tasks = [
      { title: 'Task 1', task_location: { latitude: 40.7128, longitude: -74.006 } }, // NYC
      { title: 'Task 2', task_location: null }, // No location
      { title: 'Task 3', task_location: { latitude: 41.8781, longitude: -87.6298 } }, // Chicago
    ];
  
    const sortedTasks = sortTasksByDistance(tasks, userCoords);
  

    // Expected order: Tasks with valid locations first, sorted by proximity
    expect(sortedTasks.map((task) => task.title)).toEqual(['Task 1', 'Task 3', 'Task 2']);
    expect(sortedTasks[2].distance).toBe(Infinity); // Task 2 has distance Infinity
  });
  
  

  test('returns empty array when no tasks are provided', () => {
    const tasks = [];
    const sortedTasks = sortTasksByDistance(tasks, userCoords);

    expect(sortedTasks).toEqual([]);
  });
});

const calculateDistance = require('./calculateDistance'); // Import your distance calculation function

function sortTasksByDistance(tasks, userCoords) {
    const tasksWithDistance = tasks.map((task) => {
      const { latitude, longitude } = task.task_location || {};
      if (latitude !== undefined && longitude !== undefined) {
        const distance = calculateDistance(userCoords.lat, userCoords.lon, latitude, longitude);
        return { ...task, distance };
      }
      return { ...task, distance: Infinity }; // Assign Infinity if location is invalid
    });
  
    tasksWithDistance.sort((a, b) => {
        if (a.distance === Infinity) return 1; // Place at the end
        if (b.distance === Infinity) return -1; // Place at the end
        return a.distance - b.distance;
      });
      
  
    return tasksWithDistance;
  }
  
  
  
module.exports = sortTasksByDistance;

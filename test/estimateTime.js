function estimateTime(distance, mode) {
    const speeds = {
      walking: 5, // Average speed in km/h
    };
  
    const speed = speeds[mode] || speeds.walking;
    const timeInHours = distance / speed;
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
  
    if (hours > 0) {
      return `${hours} hour(s) and ${minutes} minute(s)`;
    } else {
      return `${minutes} minute(s)`;
    }
  }
  
  module.exports = estimateTime;
  
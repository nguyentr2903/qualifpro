const estimateTime = require('./estimateTime');

describe('estimateTime', () => {
  test('calculates time for walking distance correctly', () => {
    const distance = 10; // 10 km
    const mode = 'walking';

    const result = estimateTime(distance, mode);

    expect(result).toBe('2 hour(s) and 0 minute(s)');
  });

  test('returns time in minutes for short distances', () => {
    const distance = 2.5; // 2.5 km
    const mode = 'walking';

    const result = estimateTime(distance, mode);

    expect(result).toBe('30 minute(s)');
  });

  test('defaults to walking speed for unknown modes', () => {
    const distance = 5; // 5 km
    const mode = 'flying'; // Unknown mode

    const result = estimateTime(distance, mode);

    expect(result).toBe('1 hour(s) and 0 minute(s)');
  });

  test('handles edge case of 0 distance', () => {
    const distance = 0; // 0 km
    const mode = 'walking';

    const result = estimateTime(distance, mode);

    expect(result).toBe('0 minute(s)');
  });

  test('handles very large distances correctly', () => {
    const distance = 1000; // 1000 km
    const mode = 'walking';

    const result = estimateTime(distance, mode);

    expect(result).toBe('200 hour(s) and 0 minute(s)');
  });

  test('rounds minutes correctly for fractional hours', () => {
    const distance = 3.3333; // ~3.33 km
    const mode = 'walking';

    const result = estimateTime(distance, mode);

    expect(result).toBe('40 minute(s)'); // 3.33 km @ 5 km/h = ~40 minutes
  });
});

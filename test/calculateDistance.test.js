const calculateDistance = require('./calculateDistance');

describe('calculateDistance', () => {
  test('calculates distance between two coordinates correctly', () => {
    const nyc = { lat: 40.7128, lon: -74.006 }; // test accuate longitude
    const la = { lat: 34.0522, lon: -118.2437 }; // Los Angeles

    const distance = calculateDistance(nyc.lat, nyc.lon, la.lat, la.lon);

    // Verified distance between NYC and LA: ~3935.75 km
    expect(distance).toBeCloseTo(3935.75, 2);
  });

  test('returns 0 for the same coordinates', () => {
    const lat = 40.7128;
    const lon = -74.006;

    const distance = calculateDistance(lat, lon, lat, lon);

    expect(distance).toBe(0);
  });

  test('handles coordinates on the equator correctly', () => {
    const point1 = { lat: 0, lon: 0 }; // Origin
    const point2 = { lat: 0, lon: 90 }; // 90° longitude difference

    const distance = calculateDistance(point1.lat, point1.lon, point2.lat, point2.lon);

    // Verified distance: ~10007.54 km
    expect(distance).toBeCloseTo(10007.54, 2);
  });

  test('handles negative and positive lat/lon values correctly', () => {
    const point1 = { lat: 10, lon: -10 }; // Northern Hemisphere, Western Hemisphere
    const point2 = { lat: -10, lon: 10 }; // Southern Hemisphere, Eastern Hemisphere

    const distance = calculateDistance(point1.lat, point1.lon, point2.lat, point2.lon);

    // Verified distance: ~3137.04 km
    expect(distance).toBeCloseTo(3137.04, 2);
  });
});

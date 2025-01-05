const Geocode = require('./geocode');
const fetch = require('node-fetch');

jest.mock('node-fetch');

describe('Geocode - Fetch Location', () => {
  let geocode;

  beforeEach(() => {
    geocode = new Geocode('5b3ce3597851110001cf62481a7be0629d544cfca63479c1d2ed1804');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('throws an error if API key is missing', () => {
    expect(() => new Geocode()).toThrow('API key is required');
  });

  test('throws an error if address is invalid', async () => {
    await expect(geocode.fetchLocation('')).rejects.toThrow('Address must be a non-empty string');
    await expect(geocode.fetchLocation(null)).rejects.toThrow('Address must be a non-empty string');
    await expect(geocode.fetchLocation(123)).rejects.toThrow('Address must be a non-empty string');
  });

  test('throws an error if API request fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
    });

    await expect(geocode.fetchLocation('New York')).rejects.toThrow('Failed to fetch location: Unauthorized');
  });

  test('throws an error if no location is found', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        features: [],
      }),
    });

    await expect(geocode.fetchLocation('Unknown Place')).rejects.toThrow('Location not found');
  });

  test('returns latitude and longitude for a valid address', async () => {
    const mockResponse = {
      features: [
        {
          geometry: {
            coordinates: [-74.006, 40.7128],
          },
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await geocode.fetchLocation('New York');
    expect(result).toEqual({
      latitude: 40.7128,
      longitude: -74.006,
    });
  });

  test('handles API errors gracefully', async () => {
    fetch.mockImplementationOnce(() => {
      throw new Error('Network Error');
    });

    await expect(geocode.fetchLocation('New York')).rejects.toThrow('Error fetching geocode: Network Error');
  });
});

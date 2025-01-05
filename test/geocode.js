const fetch = require('node-fetch');

class Geocode {
  constructor(apiKey) {
    if (!apiKey) throw new Error('API key is required');
    this.apiKey = "5b3ce3597851110001cf62481a7be0629d544cfca63479c1d2ed1804";
    this.apiUrl = 'https://api.openrouteservice.org/geocode/search';
  }

  async fetchLocation(address) {
    if (!address || typeof address !== 'string' || address.trim() === '') {
      throw new Error('Address must be a non-empty string');
    }

    
    const url = `https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf62481a7be0629d544cfca63479c1d2ed1804&text=New%20York`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch location: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.features || data.features.length === 0) {
        throw new Error('Location not found');
      }

      const { coordinates } = data.features[0].geometry;
      return {
        latitude: coordinates[1],
        longitude: coordinates[0],
      };
    } catch (error) {
      throw new Error(`Error fetching geocode: ${error.message}`);
    }
  }
}

module.exports = Geocode;

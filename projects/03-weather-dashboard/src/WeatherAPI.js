export class WeatherAPI {
  constructor() {
    this.baseURL = 'https://api.open-meteo.com/v1/forecast';
    this.controller = null;
    this.cache = new Map();
  }

  async fetchWeather(lat, lon) {
    if (!this.validateCoords(lat, lon)) {
      throw new Error('Invalid coordinates');
    }

    const cacheKey = `${lat},${lon}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 600000) { // 10min cache
      return cached.data;
    }

    // Cancel previous request
    if (this.controller) {
      this.controller.abort();
    }

    this.controller = new AbortController();

    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
      daily: 'temperature_2m_max,temperature_2m_min,weather_code',
      timezone: 'auto'
    });

    try {
      const response = await fetch(`${this.baseURL}?${params}`, {
        signal: this.controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const processed = this.processWeatherData(data);
      
      this.cache.set(cacheKey, {
        data: processed,
        timestamp: Date.now()
      });

      return processed;
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw err;
    }
  }

  processWeatherData(data) {
    return {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        time: data.current.time
      },
      daily: data.daily.time.map((date, i) => ({
        date,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        weatherCode: data.daily.weather_code[i]
      })),
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone
      }
    };
  }

  validateCoords(lat, lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    return !isNaN(latitude) && !isNaN(longitude) &&
           latitude >= -90 && latitude <= 90 &&
           longitude >= -180 && longitude <= 180;
  }

  getWeatherDescription(code) {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Fog',
      51: 'Light drizzle',
      53: 'Drizzle',
      55: 'Heavy drizzle',
      61: 'Light rain',
      63: 'Rain',
      65: 'Heavy rain',
      71: 'Light snow',
      73: 'Snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Light showers',
      81: 'Showers',
      82: 'Heavy showers',
      85: 'Light snow showers',
      86: 'Snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Heavy thunderstorm'
    };
    
    return descriptions[code] || 'Unknown';
  }

  getDemoData() {
    return {
      current: {
        temperature: 22.5,
        humidity: 65,
        windSpeed: 12.3,
        weatherCode: 2,
        time: new Date().toISOString()
      },
      daily: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        tempMax: 25 + Math.random() * 5,
        tempMin: 15 + Math.random() * 5,
        weatherCode: [0, 1, 2, 3, 61][Math.floor(Math.random() * 5)]
      })),
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York'
      }
    };
  }
}

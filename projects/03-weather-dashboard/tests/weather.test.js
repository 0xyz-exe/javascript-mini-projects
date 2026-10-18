import { test } from 'node:test';
import assert from 'node:assert';
import { WeatherAPI } from '../src/WeatherAPI.js';

test('validate coordinates', () => {
  const api = new WeatherAPI();
  
  assert.ok(api.validateCoords(40.7128, -74.0060));
  assert.ok(api.validateCoords(0, 0));
  assert.ok(api.validateCoords(-90, 180));
  
  assert.ok(!api.validateCoords(91, 0));
  assert.ok(!api.validateCoords(0, 181));
  assert.ok(!api.validateCoords('invalid', 0));
});

test('process weather data structure', () => {
  const api = new WeatherAPI();
  
  const mockData = {
    current: {
      temperature_2m: 20,
      relative_humidity_2m: 60,
      wind_speed_10m: 10,
      weather_code: 0,
      time: '2024-01-01T12:00'
    },
    daily: {
      time: ['2024-01-01', '2024-01-02'],
      temperature_2m_max: [22, 23],
      temperature_2m_min: [15, 16],
      weather_code: [0, 1]
    },
    latitude: 40.7,
    longitude: -74.0,
    timezone: 'America/New_York'
  };
  
  const processed = api.processWeatherData(mockData);
  
  assert.strictEqual(processed.current.temperature, 20);
  assert.strictEqual(processed.daily.length, 2);
  assert.strictEqual(processed.location.latitude, 40.7);
});

test('weather code descriptions', () => {
  const api = new WeatherAPI();
  
  assert.strictEqual(api.getWeatherDescription(0), 'Clear sky');
  assert.strictEqual(api.getWeatherDescription(61), 'Light rain');
  assert.strictEqual(api.getWeatherDescription(95), 'Thunderstorm');
  assert.ok(api.getWeatherDescription(999).includes('Unknown'));
});

test('demo data structure', () => {
  const api = new WeatherAPI();
  const demo = api.getDemoData();
  
  assert.ok(demo.current);
  assert.ok(demo.daily);
  assert.strictEqual(demo.daily.length, 7);
  assert.ok(demo.location);
});

test('cache mechanism', () => {
  const api = new WeatherAPI();
  
  api.cache.set('40,-74', {
    data: { current: { temperature: 20 } },
    timestamp: Date.now()
  });
  
  assert.strictEqual(api.cache.size, 1);
  assert.ok(api.cache.has('40,-74'));
});

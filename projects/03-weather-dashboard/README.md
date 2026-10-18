# Project 03 — Weather API Dashboard

Responsive weather dashboard using Open-Meteo free API.

## Features

- Location search (coordinates)
- Current weather conditions
- 7-day forecast
- Temperature, humidity, wind speed
- Loading and error states
- Request cancellation
- Offline demo mode
- Response caching

## Technology Stack

- JavaScript (ES2022+)
- Fetch API with AbortController
- Open-Meteo free API (no key required)

## Installation

Open `src/index.html` in a modern browser.

## Usage

1. Enter latitude/longitude or use examples
2. Click "Get Weather"
3. View current conditions and forecast
4. Toggle demo mode for offline testing

### Demo Mode

Click "Use Demo Data" for offline testing with sample weather data.

## API

Uses Open-Meteo free API:
- No API key required
- No rate limits for reasonable use
- https://open-meteo.com/

## Testing

```bash
node --test tests/weather.test.js
```

## Known Limitations

- Requires coordinates (no city name geocoding)
- No location auto-detection
- Basic caching (session storage)

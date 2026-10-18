import { WeatherAPI } from './WeatherAPI.js';

class WeatherApp {
  constructor() {
    this.api = new WeatherAPI();
    this.elements = {
      latInput: document.getElementById('latInput'),
      lonInput: document.getElementById('lonInput'),
      fetchBtn: document.getElementById('fetchBtn'),
      demoBtn: document.getElementById('demoBtn'),
      currentWeather: document.getElementById('currentWeather'),
      forecast: document.getElementById('forecast'),
      loading: document.getElementById('loading'),
      error: document.getElementById('error')
    };

    this.setupEventListeners();
    this.loadExamples();
  }

  setupEventListeners() {
    this.elements.fetchBtn.addEventListener('click', () => this.fetchWeather());
    this.elements.demoBtn.addEventListener('click', () => this.showDemo());

    [this.elements.latInput, this.elements.lonInput].forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.fetchWeather();
      });
    });
  }

  loadExamples() {
    const examples = document.querySelectorAll('.example-location');
    examples.forEach(ex => {
      ex.addEventListener('click', () => {
        this.elements.latInput.value = ex.dataset.lat;
        this.elements.lonInput.value = ex.dataset.lon;
      });
    });
  }

  async fetchWeather() {
    const lat = this.elements.latInput.value.trim();
    const lon = this.elements.lonInput.value.trim();

    if (!lat || !lon) {
      this.showError('Please enter coordinates');
      return;
    }

    this.showLoading();

    try {
      const data = await this.api.fetchWeather(lat, lon);
      this.renderWeather(data);
    } catch (err) {
      this.showError(err.message);
    }
  }

  showDemo() {
    const data = this.api.getDemoData();
    this.renderWeather(data, true);
  }

  showLoading() {
    this.elements.loading.style.display = 'block';
    this.elements.error.style.display = 'none';
    this.elements.currentWeather.style.display = 'none';
    this.elements.forecast.style.display = 'none';
  }

  showError(message) {
    this.elements.loading.style.display = 'none';
    this.elements.error.style.display = 'block';
    this.elements.error.textContent = `Error: ${message}`;
    this.elements.currentWeather.style.display = 'none';
    this.elements.forecast.style.display = 'none';
  }

  renderWeather(data, isDemo = false) {
    this.elements.loading.style.display = 'none';
    this.elements.error.style.display = 'none';
    this.elements.currentWeather.style.display = 'block';
    this.elements.forecast.style.display = 'block';

    // Render current weather
    const current = data.current;
    const weatherDesc = this.api.getWeatherDescription(current.weatherCode);
    
    this.elements.currentWeather.innerHTML = `
      ${isDemo ? '<div class="demo-badge">DEMO DATA</div>' : ''}
      <div class="location-info">
        <h3>Current Weather</h3>
        <p>${data.location.latitude.toFixed(2)}°, ${data.location.longitude.toFixed(2)}°</p>
      </div>
      <div class="current-main">
        <div class="temp-large">${Math.round(current.temperature)}°C</div>
        <div class="weather-desc">${weatherDesc}</div>
      </div>
      <div class="current-details">
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">${current.humidity}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind Speed</span>
          <span class="detail-value">${current.windSpeed.toFixed(1)} km/h</span>
        </div>
      </div>
    `;

    // Render forecast
    const forecastHTML = data.daily.slice(0, 7).map(day => `
      <div class="forecast-day">
        <div class="forecast-date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        <div class="forecast-weather">${this.api.getWeatherDescription(day.weatherCode)}</div>
        <div class="forecast-temps">
          <span class="temp-max">${Math.round(day.tempMax)}°</span>
          <span class="temp-min">${Math.round(day.tempMin)}°</span>
        </div>
      </div>
    `).join('');

    this.elements.forecast.innerHTML = `
      <h3>7-Day Forecast</h3>
      <div class="forecast-grid">${forecastHTML}</div>
    `;
  }
}

new WeatherApp();

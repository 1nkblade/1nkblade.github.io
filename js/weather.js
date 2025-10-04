/**
 * Weather Widget for Modena
 * Fetches and displays current weather information using Open-Meteo API
 */

class WeatherWidget {
    constructor() {
        // Open-Meteo API configuration
        this.apiUrl = 'https://api.open-meteo.com/v1/forecast';
        this.city = 'Modena';
        this.latitude = 44.6471; // Modena coordinates
        this.longitude = 10.9252;
        this.units = 'metric';
        this.updateInterval = 300000; // 5 minutes
        this.retryInterval = 60000; // 1 minute on error
        
        this.init();
    }
    
    init() {
        this.setupFallbackData();
        this.fetchWeather();
        
        // Set up periodic updates
        setInterval(() => {
            this.fetchWeather();
        }, this.updateInterval);
    }
    
    setupFallbackData() {
        // Fallback data when API is not available
        this.fallbackData = {
            temperature: '22°',
            feels_like: '24°',
            description: 'Partly cloudy',
            icon: 'bi-cloud-sun'
        };
    }
    
    async fetchWeather() {
        try {
            // Open-Meteo API call for current weather
            const params = new URLSearchParams({
                latitude: this.latitude,
                longitude: this.longitude,
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code',
                hourly: 'temperature_2m',
                timezone: 'Europe/Rome'
            });

            const response = await fetch(`${this.apiUrl}?${params}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const weatherData = this.processWeatherData(data);
            this.updateDisplay(weatherData);
            
        } catch (error) {
            console.log('Weather API unavailable, using fallback data:', error);
            this.updateDisplay(this.fallbackData);
            
            // Retry after a delay
            setTimeout(() => {
                this.fetchWeather();
            }, this.retryInterval);
        }
    }
    
    processWeatherData(data) {
        const current = data.current;
        const weatherCode = current.weather_code;
        const temperature = Math.round(current.temperature_2m);
        const apparentTemp = Math.round(current.apparent_temperature);
        
        // Map weather codes to descriptions and icons
        const weatherMapping = this.getWeatherMapping(weatherCode);
        
        return {
            temperature: `${temperature}°`,
            feels_like: `${apparentTemp}°`,
            description: weatherMapping.description,
            icon: weatherMapping.icon
        };
    }
    
    getWeatherMapping(code) {
        // Open-Meteo weather codes mapping
        const weatherCodes = {
            0: { description: 'Clear sky', icon: 'bi-sun' },
            1: { description: 'Mainly clear', icon: 'bi-sun' },
            2: { description: 'Partly cloudy', icon: 'bi-cloud-sun' },
            3: { description: 'Overcast', icon: 'bi-cloud' },
            45: { description: 'Foggy', icon: 'bi-cloud-fog' },
            48: { description: 'Depositing rime fog', icon: 'bi-cloud-fog' },
            51: { description: 'Light drizzle', icon: 'bi-cloud-drizzle' },
            53: { description: 'Moderate drizzle', icon: 'bi-cloud-drizzle' },
            55: { description: 'Dense drizzle', icon: 'bi-cloud-drizzle' },
            61: { description: 'Slight rain', icon: 'bi-cloud-rain' },
            63: { description: 'Moderate rain', icon: 'bi-cloud-rain' },
            65: { description: 'Heavy rain', icon: 'bi-cloud-rain-heavy' },
            71: { description: 'Slight snow', icon: 'bi-cloud-snow' },
            73: { description: 'Moderate snow', icon: 'bi-cloud-snow' },
            75: { description: 'Heavy snow', icon: 'bi-cloud-snow' },
            77: { description: 'Snow grains', icon: 'bi-cloud-snow' },
            80: { description: 'Slight rain showers', icon: 'bi-cloud-rain' },
            81: { description: 'Moderate rain showers', icon: 'bi-cloud-rain' },
            82: { description: 'Violent rain showers', icon: 'bi-cloud-rain-heavy' },
            85: { description: 'Slight snow showers', icon: 'bi-cloud-snow' },
            86: { description: 'Heavy snow showers', icon: 'bi-cloud-snow' },
            95: { description: 'Thunderstorm', icon: 'bi-cloud-lightning' },
            96: { description: 'Thunderstorm with hail', icon: 'bi-cloud-lightning-rain' },
            99: { description: 'Heavy thunderstorm', icon: 'bi-cloud-lightning-rain' }
        };
        
        return weatherCodes[code] || { description: 'Unknown', icon: 'bi-question-circle' };
    }
    
    generateMockWeather() {
        // Generate realistic mock data for Modena
        const conditions = [
            { desc: 'Sunny', icon: 'bi-sun', temp: 28, feels: 30 },
            { desc: 'Partly cloudy', icon: 'bi-cloud-sun', temp: 24, feels: 26 },
            { desc: 'Cloudy', icon: 'bi-cloud', temp: 20, feels: 21 },
            { desc: 'Light rain', icon: 'bi-cloud-rain', temp: 18, feels: 19 },
            { desc: 'Overcast', icon: 'bi-clouds', temp: 16, feels: 17 }
        ];
        
        const current = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            temperature: `${current.temp}°`,
            feels_like: `${current.feels}°`,
            description: current.desc,
            icon: current.icon
        };
    }
    
    updateDisplay(weatherData) {
        // Update temperature
        const tempElement = document.getElementById('weather-temperature');
        if (tempElement) {
            tempElement.textContent = weatherData.temperature;
        }
        
        // Update feels like
        const feelsElement = document.getElementById('weather-feels');
        if (feelsElement) {
            feelsElement.textContent = weatherData.feels_like;
        }
        
        // Update description
        const descElement = document.getElementById('weather-description');
        if (descElement) {
            descElement.textContent = weatherData.description;
        }
        
        // Update icon
        const iconElement = document.getElementById('weather-icon');
        if (iconElement) {
            iconElement.innerHTML = `<i class="${weatherData.icon}"></i>`;
        }
        
        // Add subtle animation
        this.animateUpdate();
    }
    
    animateUpdate() {
        const widget = document.querySelector('.weather-widget');
        if (widget) {
            widget.style.transform = 'scale(0.95)';
            setTimeout(() => {
                widget.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    // Method to manually refresh weather
    refresh() {
        this.fetchWeather();
    }
    
    // Method to change city (for future use)
    changeCity(newCity) {
        this.city = newCity;
        this.fetchWeather();
    }
}

// Initialize weather widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        window.weatherWidget = new WeatherWidget();
    }, 500);
});

// Expose weather widget globally for debugging
window.WeatherWidget = WeatherWidget;

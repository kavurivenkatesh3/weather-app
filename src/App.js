// src/App.js
import React, { useState, useEffect } from 'react';
import CityTabs from './components/CityTabs';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import { getCurrentWeather, getForecast, isApiKeySet } from './api/weather';
import './App.css';

function App() {
  // Using the original cities from the requirements
  const [cities] = useState(['Rio de Janeiro', 'Beijing', 'Los Angeles']);
  const [activeCity, setActiveCity] = useState('Rio de Janeiro');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  const fetchWeatherData = async (city) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if API key is set
      if (!isApiKeySet()) {
        setApiKeyMissing(true);
        setLoading(false);
        return;
      }
      
      // Fetch current weather
      const weatherData = await getCurrentWeather(city);
      setCurrentWeather(weatherData);
      
      // Fetch forecast
      const forecastData = await getForecast(city);
      
      // Process hourly forecast (next 8 hours)
      const hourly = forecastData.list.slice(0, 8);
      setHourlyForecast(hourly);
      
      // Process daily forecast (next 5 days)
      const daily = [];
      const daysProcessed = {};
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!daysProcessed[date]) {
          daysProcessed[date] = true;
          daily.push(item);
          if (daily.length >= 5) break;
        }
      }
      setDailyForecast(daily);
      
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch weather data: ${err.message}`);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWeatherData(activeCity);
  }, [activeCity]);
  
  const handleCityChange = (city) => {
    setActiveCity(city);
  };
  
  const handleRefresh = () => {
    fetchWeatherData(activeCity);
  };
  
  const handleSearch = (query) => {
    setActiveCity(query);
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather App</h1>
      </header>
      
      <main className="app-main">
        <CityTabs 
          cities={cities} 
          activeCity={activeCity} 
          onCityChange={handleCityChange} 
        />
        
        <SearchBar onSearch={handleSearch} />
        
        {apiKeyMissing && (
          <div className="error-message api-key-error">
            <h3>API Key Required</h3>
            <p>Please add your OpenWeatherMap API key to the weather.js file.</p>
            <p>You can get a free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a>.</p>
          </div>
        )}
        
        {error && !apiKeyMissing && <div className="error-message">{error}</div>}
        
        {loading && !apiKeyMissing ? (
          <div className="loading">Loading weather data...</div>
        ) : !apiKeyMissing ? (
          <>
            <WeatherDisplay 
              weather={currentWeather} 
              onRefresh={handleRefresh} 
            />
            
            <div className="forecast-container">
              <ForecastList forecast={hourlyForecast} type="hourly" />
              <ForecastList forecast={dailyForecast} type="daily" />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

export default App;
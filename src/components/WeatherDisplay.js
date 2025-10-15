// src/components/WeatherDisplay.js
import React from 'react';

const WeatherDisplay = ({ weather, onRefresh }) => {
  if (!weather) {
    return <div className="weather-loading">Loading weather data...</div>;
  }
  
  const getIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  // Format city name with state if available
  const formatCityName = (weather) => {
    const cityName = weather.name;
    const country = weather.sys.country;
    
    if (country === 'US') {
      return `${cityName}, USA`;
    } else {
      return `${cityName}, ${country}`;
    }
  };
  
  return (
    <div className="weather-display">
      <div className="weather-header">
        <h2>{formatCityName(weather)}</h2>
        <button className="refresh-button" onClick={onRefresh}>Refresh</button>
      </div>
      
      <div className="current-weather">
        <div className="weather-main">
          <img 
            src={getIconUrl(weather.weather[0].icon)} 
            alt={weather.weather[0].description}
            className="weather-icon"
          />
          <div className="temperature">{Math.round(weather.main.temp)}°C</div>
        </div>
        
        <div className="weather-details">
          <div className="weather-description">{weather.weather[0].description}</div>
          <div className="weather-info">
            <div className="info-item">
              <span className="info-label">Feels like:</span>
              <span className="info-value">{Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div className="info-item">
              <span className="info-label">Humidity:</span>
              <span className="info-value">{weather.main.humidity}%</span>
            </div>
            <div className="info-item">
              <span className="info-label">Wind:</span>
              <span className="info-value">{weather.wind.speed} m/s</span>
            </div>
            <div className="info-item">
              <span className="info-label">Pressure:</span>
              <span className="info-value">{weather.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
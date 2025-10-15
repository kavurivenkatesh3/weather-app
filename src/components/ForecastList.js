// src/components/ForecastList.js
import React from 'react';

const ForecastList = ({ forecast, type }) => {
  const getIconUrl = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="forecast-list">
      <h3>{type === 'hourly' ? 'Next Hours' : 'Next Days'}</h3>
      <div className="forecast-items">
        {forecast.map((item, index) => (
          <div key={index} className="forecast-item">
            <div className="forecast-time">
              {type === 'hourly' ? formatTime(item.dt) : formatDate(item.dt)}
            </div>
            <img 
              src={getIconUrl(item.weather[0].icon)} 
              alt={item.weather[0].description}
              className="forecast-icon"
            />
            <div className="forecast-temp">{Math.round(item.main.temp)}°C</div>
            <div className="forecast-desc">{item.weather[0].description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;
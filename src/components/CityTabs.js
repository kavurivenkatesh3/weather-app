// src/components/CityTabs.js
import React from 'react';

const CityTabs = ({ cities, activeCity, onCityChange }) => {
  return (
    <div className="city-tabs">
      {cities.map(city => (
        <button
          key={city}
          className={`city-tab ${activeCity === city ? 'active' : ''}`}
          onClick={() => onCityChange(city)}
        >
          {city}
        </button>
      ))}
    </div>
  );
};

export default CityTabs;
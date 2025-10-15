const API_KEY = "482944e26d320a80bd5e4f23b3de7d1f";
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Check if API key is set
export const isApiKeySet = () => {
  return API_KEY !== 'YOUR_API_KEY_HERE';
};

export const getCurrentWeather = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Weather data not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getForecast = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Forecast data not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

export const searchCities = async (query) => {
  try {
    // Using OpenWeatherMap's Geocoding API for city search
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'City search failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};
// src/components/SearchBar.js
import React, { useState, useEffect, useRef } from 'react';
import { searchCities } from '../api/weather';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search function
  const debouncedSearch = (searchQuery) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        try {
          setLoading(true);
          const cities = await searchCities(searchQuery);
          setSuggestions(cities.slice(0, 8)); // Limit to 8 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching city suggestions:', error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms delay
  };

  useEffect(() => {
    debouncedSearch(query);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (city) => {
    const cityName = city.name;
    if (city.state && city.country === 'US') {
      onSearch(`${cityName}, ${city.state}`);
    } else if (city.country) {
      onSearch(`${cityName}, ${city.country}`);
    } else {
      onSearch(cityName);
    }
    setQuery('');
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  
  return (
    <div className="search-container" ref={suggestionsRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 2 && setShowSuggestions(true)}
            placeholder="Search for a city..."
            className="search-input"
            autoComplete="off"
          />
          {loading && (
            <div className="search-loading">
              <div className="search-spinner"></div>
            </div>
          )}
        </div>
        <button type="submit" className="search-button">Search</button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((city, index) => (
            <div
              key={`${city.lat}-${city.lon}-${index}`}
              className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(city)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="suggestion-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="suggestion-text">
                <div className="suggestion-name">{city.name}</div>
                <div className="suggestion-details">
                  {city.state && `${city.state}, `}
                  {city.country}
                </div>
              </div>
              <div className="suggestion-coords">
                {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

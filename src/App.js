import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(
    "images/default-weather.jpg"
  );
  const [animationClass, setAnimationClass] = useState("futuristic");

  const fetchWeather = async (cityName) => {
    try {
      setError("");
      const apiKey = "5ca5e629bb0cd235a4773937f4bf8ac6";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const data = response.data;
      setWeatherData(data);
      const weatherCondition = data.weather[0].main.toLowerCase();
      setBackgroundImage(getBackgroundImage(weatherCondition)); // Set background based on weather condition
      setAnimationClass(getAnimationClass(weatherCondition));
    } catch (err) {
      setWeatherData(null);
      setError(
        "Could not fetch weather data. Please check the city name and try again."
      );
    }
  };
  const getBackgroundImage = (condition) => {
    switch (condition) {
      case "clear":
        return "/images/clear-sky.jpg";
      case "clouds":
        return "/images/cloudy.jpg";
      case "rain":
        return "/images/rainy.jpg";
      case "storm":
      case "thunderstorm":
        return "/images/stormy.jpg";
      case "snow":
        return "/images/snowy.jpg";
      default:
        return "/images/default-weather.jpg";
    }
  };

  const getAnimationClass = (condition) => {
    switch (condition) {
      case "clear":
        return "clear-sky-animation"; // Add specific animation class
      case "clouds":
        return "cloudy-animation";
      case "rain":
        return "rainy-animation";
      case "storm":
      case "thunderstorm":
        return "stormy-animation";
      case "snow":
        return "snowy-animation";
      default:
        return "default-weather-animation";
    }
  };

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setError("");
          const apiKey = "5ca5e629bb0cd235a4773937f4bf8ac6";
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          const data = response.data;
          setWeatherData(data);
          setBackgroundImage(
            getBackgroundImage(data.weather[0].main.toLowerCase())
          );
          setAnimationClass(
            getAnimationClass(data.weather[0].main.toLowerCase())
          );
        } catch (err) {
          setError("Could not fetch weather data for your location.");
        }
      });
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div
      className={`app futuristic ${animationClass}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      <header className="app-header">
        <h1 className="app-title">
          A.T. WORLD <span className="futuristic-glow">WEATHER</span>
        </h1>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter City Name..."
              value={city}
              onChange={handleInputChange}
              className="search-input futuristic-input"
            />
            <button type="submit" className="search-button futuristic-button">
              <FaSearch />
            </button>
          </div>
        </form>
        <button
          onClick={handleGeolocation}
          className="location-button futuristic-button"
        >
          <FaMapMarkerAlt /> Use My Location
        </button>
        {error && <p className="error-message futuristic-text">{error}</p>}
        {weatherData && (
          <div className="weather-info futuristic-card">
            <h2 className="weather-location">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <div className="weather-details">
              <div className="weather-temp">
                <span className="temp-value futuristic-text">
                  {weatherData.main.temp}&deg;C
                </span>
              </div>
              <div className="weather-condition">
                <p>{weatherData.weather[0].description}</p>
              </div>
              <div className="weather-stats">
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Wind Speed: {weatherData.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default App;

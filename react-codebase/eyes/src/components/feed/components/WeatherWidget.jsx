import React from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';
import styles from '../styles/weatherWidget.module.css';

const WeatherWidget = () => {
  // Mock weather data - in a real app, this would come from a weather API
  const weatherData = {
    location: 'San Francisco, CA',
    temperature: 72,
    condition: 'Sunny',
    high: 78,
    low: 65,
    forecast: [
      { day: 'Mon', icon: 'sunny', temp: 78 },
      { day: 'Tue', icon: 'partly-cloudy', temp: 74 },
      { day: 'Wed', icon: 'rain', temp: 68 },
      { day: 'Thu', icon: 'cloudy', temp: 70 },
      { day: 'Fri', icon: 'sunny', temp: 76 },
    ],
  };

  const getWeatherIcon = (condition) => {
    const iconSize = 24;
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <WiDaySunny size={iconSize} className={styles.sunny} />;
      case 'partly-cloudy':
        return <WiCloudy size={iconSize} className={styles.cloudy} />;
      case 'cloudy':
        return <WiCloudy size={iconSize} className={styles.cloudy} />;
      case 'rain':
        return <WiRain size={iconSize} className={styles.rain} />;
      case 'snow':
        return <WiSnow size={iconSize} className={styles.snow} />;
      case 'thunderstorm':
        return <WiThunderstorm size={iconSize} className={styles.thunderstorm} />;
      case 'fog':
        return <WiFog size={iconSize} className={styles.fog} />;
      default:
        return <WiDaySunny size={iconSize} className={styles.sunny} />;
    }
  };

  return (
    <div className={styles.weatherWidget}>
      <div className={styles.weatherHeader}>
        <h3>Weather</h3>
        <span className={styles.location}>{weatherData.location}</span>
      </div>
      
      <div className={styles.currentWeather}>
        <div className={styles.currentTemp}>
          <div className={styles.tempValue}>{weatherData.temperature}°</div>
          <div className={styles.weatherCondition}>{weatherData.condition}</div>
          <div className={styles.highLow}>
            H: {weatherData.high}° L: {weatherData.low}°
          </div>
        </div>
        <div className={styles.weatherIcon}>
          {getWeatherIcon(weatherData.condition.toLowerCase())}
        </div>
      </div>
      
      <div className={styles.forecast}>
        {weatherData.forecast.map((day, index) => (
          <div key={index} className={styles.forecastDay}>
            <div className={styles.forecastDayName}>{day.day}</div>
            <div className={styles.forecastIcon}>
              {getWeatherIcon(day.icon)}
            </div>
            <div className={styles.forecastTemp}>{day.temp}°</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;

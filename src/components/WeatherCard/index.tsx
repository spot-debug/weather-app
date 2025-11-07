import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData, TemperatureUnit } from '../../types/weather';

interface WeatherCardProps {
  weatherData: WeatherData;
  temperatureUnit: TemperatureUnit;
  onToggleUnit: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, temperatureUnit, onToggleUnit }) => {
  const { location, current } = weatherData;

  const getWeatherGradient = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    switch (conditionLower) {
      case 'clear':
        return 'bg-sunny-gradient';
      case 'clouds':
        return 'bg-cloudy-gradient';
      case 'rain':
      case 'drizzle':
        return 'bg-rainy-gradient';
      case 'thunderstorm':
        return 'bg-gradient-to-br from-gray-700 to-gray-900';
      case 'snow':
        return 'bg-gradient-to-br from-blue-100 to-gray-300';
      case 'mist':
      case 'fog':
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
      default:
        return 'bg-weather-gradient';
    }
  };

  const getWeatherIcon = (iconCode: string): string => {
    // Map OpenWeatherMap icon codes to emojis
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️',
    };
    return iconMap[iconCode] || '🌤️';
  };

  const formatTemperature = (temp: number): string => {
    const unit = temperatureUnit === 'celsius' ? '°C' : '°F';
    if (temperatureUnit === 'fahrenheit') {
      return `${Math.round((temp * 9/5) + 32)}${unit}`;
    }
    return `${temp}${unit}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`weather-card ${getWeatherGradient(current.condition)} text-white relative overflow-hidden max-w-2xl mx-auto`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {current.condition.toLowerCase() === 'rain' && (
          <div className="rain-animation">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-8 bg-white bg-opacity-30 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}
        {current.condition.toLowerCase() === 'clear' && (
          <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-300 bg-opacity-30 rounded-full animate-pulse-slow" />
        )}
      </div>

      <div className="relative z-10">
        {/* Location and Date */}
        <div className="text-center mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            {location.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg opacity-90"
          >
            {location.country}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm opacity-75"
          >
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </motion.p>
        </div>

        {/* Temperature and Weather Icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="text-8xl mb-4"
          >
            {getWeatherIcon(current.icon)}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative inline-block"
          >
            <span className="text-7xl font-light">
              {formatTemperature(current.temperature)}
            </span>
            <button
              onClick={onToggleUnit}
              className="absolute -top-2 -right-8 text-sm opacity-70 hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-20 rounded px-1 py-0.5"
              aria-label="Toggle temperature unit"
            >
              {temperatureUnit === 'celsius' ? '°F' : '°C'}
            </button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl capitalize mt-2"
          >
            {current.description}
          </motion.p>
        </div>

        {/* Weather Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 gap-4 text-center"
        >
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-sm opacity-75">Feels Like</div>
            <div className="text-lg font-semibold">
              {formatTemperature(current.feelsLike)}
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="text-sm opacity-75">Humidity</div>
            <div className="text-lg font-semibold">{current.humidity}%</div>
          </div>
        </motion.div>

        {/* Additional Weather Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 pt-4 border-t border-white border-opacity-20 text-center text-sm opacity-75"
        >
          Last updated: {new Date(weatherData.lastUpdated).toLocaleTimeString()}
        </motion.div>
      </div>

      </motion.div>
  );
};

export default WeatherCard;
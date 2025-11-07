import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherForecast as WeatherForecastType, TemperatureUnit } from '../../types/weather';

interface WeatherForecastProps {
  forecast: WeatherForecastType[];
  temperatureUnit: TemperatureUnit;
}

interface ForecastDayProps {
  day: WeatherForecastType;
  temperatureUnit: TemperatureUnit;
  delay: number;
  isToday?: boolean;
}

const ForecastDay: React.FC<ForecastDayProps> = ({ day, temperatureUnit, delay, isToday = false }) => {
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

  const getRainChanceColor = (chance: number): string => {
    if (chance >= 70) return 'text-blue-600';
    if (chance >= 40) return 'text-blue-500';
    if (chance >= 20) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`weather-metric cursor-pointer min-w-[140px] ${
        isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
    >
      <div className="text-center">
        {/* Day Name */}
        <div className={`font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
          {day.dayName}
        </div>

        {/* Date */}
        <div className="text-xs text-gray-500 mb-3">
          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>

        {/* Weather Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
          className="text-4xl mb-3"
        >
          {getWeatherIcon(day.icon)}
        </motion.div>

        {/* Condition */}
        <div className="text-xs text-gray-600 mb-3 capitalize h-6">
          {day.description}
        </div>

        {/* Temperature */}
        <div className="mb-3">
          <div className="text-xl font-bold text-gray-800">
            {formatTemperature(day.temperature.avg)}
          </div>
          <div className="text-xs text-gray-500">
            {formatTemperature(day.temperature.min)} - {formatTemperature(day.temperature.max)}
          </div>
        </div>

        {/* Rain Chance */}
        <div className={`text-sm font-medium ${getRainChanceColor(day.rainChance)}`}>
          🌧️ {day.rainChance}%
        </div>

        {/* Additional Info on Hover */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          whileHover={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600"
        >
          <div>💨 {day.windSpeed} m/s</div>
          <div>💧 {day.humidity}%</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, temperatureUnit }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');

  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="text-2xl font-bold text-gray-800"
        >
          Weather Forecast
        </motion.h2>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="flex bg-gray-100 rounded-lg p-1"
        >
          <button
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'daily'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewMode('hourly')}
            disabled
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'hourly'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Hourly view coming soon"
          >
            Hourly
          </button>
        </motion.div>
      </div>

      {/* Forecast Cards */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          <AnimatePresence>
            {forecast.map((day, index) => (
              <ForecastDay
                key={day.date}
                day={day}
                temperatureUnit={temperatureUnit}
                delay={0.8 + index * 0.1}
                isToday={index === 0}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mt-6 bg-blue-50 rounded-xl p-4 text-center"
      >
        <p className="text-sm text-blue-800">
          <span className="font-semibold">5-day forecast:</span>{' '}
          {forecast.reduce((sum, day) => sum + day.rainChance, 0) / forecast.length > 30
            ? 'Rain expected on multiple days. Keep an umbrella handy!'
            : 'Mostly clear conditions expected. Great weather ahead!'}
        </p>
      </motion.div>

      {/* Extended Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🌡️</div>
          <div className="text-sm font-medium text-gray-600">Avg Temperature</div>
          <div className="text-lg font-bold text-gray-800">
            {Math.round(forecast.reduce((sum, day) => sum + day.temperature.avg, 0) / forecast.length)}°
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🌧️</div>
          <div className="text-sm font-medium text-gray-600">Rainiest Day</div>
          <div className="text-lg font-bold text-blue-600">
            {forecast.reduce((max, day) => day.rainChance > max.rainChance ? day : max).dayName}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">☀️</div>
          <div className="text-sm font-medium text-gray-600">Warmest Day</div>
          <div className="text-lg font-bold text-orange-600">
            {forecast.reduce((max, day) => day.temperature.max > max.temperature.max ? day : max).dayName}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherForecast;
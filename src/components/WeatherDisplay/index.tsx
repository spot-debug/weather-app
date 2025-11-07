import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData, TemperatureUnit } from '../../types/weather';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  temperatureUnit: TemperatureUnit;
}

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="weather-metric p-6 text-center"
  >
    <div className="text-3xl mb-3 text-blue-600">{icon}</div>
    <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </motion.div>
);

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData, temperatureUnit }) => {
  const { current, forecast } = weatherData;

  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getUVIndexLevel = (index: number): { level: string; color: string } => {
    if (index <= 2) return { level: 'Low', color: 'text-green-600' };
    if (index <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
    if (index <= 7) return { level: 'High', color: 'text-orange-600' };
    if (index <= 10) return { level: 'Very High', color: 'text-red-600' };
    return { level: 'Extreme', color: 'text-purple-600' };
  };

  const getVisibilityDescription = (visibility: number): string => {
    if (visibility >= 10) return 'Excellent';
    if (visibility >= 5) return 'Good';
    if (visibility >= 2) return 'Moderate';
    if (visibility >= 1) return 'Poor';
    return 'Very Poor';
  };

  const formatWindSpeed = (speed: number): string => {
    return temperatureUnit === 'fahrenheit' ? `${speed} mph` : `${speed} m/s`;
  };

  const formatVisibility = (visibility: number): string => {
    return temperatureUnit === 'fahrenheit' ? `${Math.round(visibility * 0.621371)} mi` : `${visibility} km`;
  };

  const formatPressure = (pressure: number): string => {
    return `${pressure} hPa`;
  };

  const rainChance = forecast.length > 0 ? forecast[0].rainChance : 0;

  const uvInfo = getUVIndexLevel(current.uvIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-bold text-gray-800 mb-6 text-center"
      >
        Weather Details
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          icon={
            <div className="relative">
              💧
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          }
          value={`${current.humidity}%`}
          label="Humidity"
          delay={0.6}
        />

        <MetricCard
          icon="🌧️"
          value={`${rainChance}%`}
          label="Rain Chance"
          delay={0.7}
        />

        <MetricCard
          icon="💨"
          value={`${formatWindSpeed(current.windSpeed)} ${getWindDirection(current.windDirection)}`}
          label="Wind"
          delay={0.8}
        />

        <MetricCard
          icon={
            <div className="relative">
              ☀️
              <div className={`absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full ${current.uvIndex > 5 ? 'animate-pulse' : ''}`}></div>
            </div>
          }
          value={
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">{current.uvIndex}</span>
              <span className={`text-xs font-medium ${uvInfo.color}`}>{uvInfo.level}</span>
            </div>
          }
          label="UV Index"
          delay={0.9}
        />

        <MetricCard
          icon="👁️"
          value={formatVisibility(current.visibility)}
          label={`Visibility (${getVisibilityDescription(current.visibility)})`}
          delay={1.0}
        />

        <MetricCard
          icon="🌡️"
          value={formatPressure(current.pressure)}
          label="Pressure"
          delay={1.1}
        />
      </div>

      {/* Additional Weather Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-8 bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🌡️</div>
            <div>
              <div className="font-medium text-gray-800">Comfort Level</div>
              <div className="text-sm text-gray-600">
                {current.temperature > 30
                  ? 'Very Hot - Stay hydrated and avoid prolonged sun exposure'
                  : current.temperature > 20
                  ? 'Comfortable - Great weather for outdoor activities'
                  : current.temperature > 10
                  ? 'Cool - Light jacket recommended'
                  : 'Cold - Warm clothing advised'}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="text-2xl">🏃</div>
            <div>
              <div className="font-medium text-gray-800">Outdoor Activities</div>
              <div className="text-sm text-gray-600">
                {rainChance > 70
                  ? 'Poor - Heavy rain expected'
                  : rainChance > 30
                  ? 'Fair - Light rain possible'
                  : current.humidity > 80
                  ? 'Good but humid'
                  : 'Excellent - Ideal conditions'}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="text-2xl">🚗</div>
            <div>
              <div className="font-medium text-gray-800">Driving Conditions</div>
              <div className="text-sm text-gray-600">
                {current.visibility < 2
                  ? 'Poor - Reduced visibility'
                  : current.windSpeed > 10
                  ? 'Moderate - Strong winds'
                  : rainChance > 50
                  ? 'Fair - Wet roads possible'
                  : 'Good - Clear conditions'}
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="text-2xl">☀️</div>
            <div>
              <div className="font-medium text-gray-800">Sun Protection</div>
              <div className="text-sm text-gray-600">
                {current.uvIndex > 7
                  ? 'Required - SPF 30+ recommended'
                  : current.uvIndex > 5
                  ? 'Advised - SPF 15+ recommended'
                  : current.uvIndex > 2
                  ? 'Optional - Light protection'
                  : 'Not necessary'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WeatherDisplay;
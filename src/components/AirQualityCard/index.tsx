import React from 'react';
import { motion } from 'framer-motion';
import { AirQualityData } from '../../types/weather';

interface AirQualityCardProps {
  airQuality: AirQualityData | null;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  if (!airQuality) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="weather-card bg-gray-100 border-2 border-dashed border-gray-300 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">🌫️</div>
            <p>Air quality data not available</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const getAQILevelInfo = (level: AirQualityData['level']) => {
    switch (level) {
      case 'good':
        return {
          icon: '😊',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          progressColor: 'bg-green-500',
        };
      case 'moderate':
        return {
          icon: '😐',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          progressColor: 'bg-yellow-500',
        };
      case 'unhealthy-sensitive':
        return {
          icon: '😷',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          progressColor: 'bg-orange-500',
        };
      case 'unhealthy':
        return {
          icon: '😵',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          progressColor: 'bg-red-500',
        };
      case 'very-unhealthy':
        return {
          icon: '🤢',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800',
          progressColor: 'bg-purple-500',
        };
      case 'hazardous':
        return {
          icon: '☠️',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300',
          textColor: 'text-red-900',
          progressColor: 'bg-red-700',
        };
      default:
        return {
          icon: '❓',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          progressColor: 'bg-gray-500',
        };
    }
  };

  const getTrendIcon = (trend: AirQualityData['trend']) => {
    switch (trend) {
      case 'improving':
        return '📉';
      case 'worsening':
        return '📈';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const formatPollutantName = (key: string): string => {
    const names: { [key: string]: string } = {
      pm2_5: 'PM2.5',
      pm10: 'PM10',
      o3: 'Ozone',
      no2: 'Nitrogen Dioxide',
      so2: 'Sulfur Dioxide',
      co: 'Carbon Monoxide',
      no: 'Nitric Oxide',
      nh3: 'Ammonia',
    };
    return names[key] || key;
  };

  const getPollutantUnit = (key: string): string => {
    return key === 'co' ? 'mg/m³' : 'μg/m³';
  };

  const aqiInfo = getAQILevelInfo(airQuality.level);
  const maxAQI = 500;
  const aqiPercentage = Math.min((airQuality.aqi / maxAQI) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className={`weather-card ${aqiInfo.bgColor} ${aqiInfo.borderColor} border-2`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className={`text-2xl font-bold ${aqiInfo.textColor}`}
          >
            Air Quality Index
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">{getTrendIcon(airQuality.trend)}</span>
            <span className={`text-sm font-medium capitalize ${aqiInfo.textColor}`}>
              {airQuality.trend}
            </span>
          </motion.div>
        </div>

        {/* AQI Score */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
            className="mb-4"
          >
            <div className="text-8xl mb-2">{aqiInfo.icon}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-2"
          >
            <span className="text-6xl font-bold" style={{ color: airQuality.color }}>
              {airQuality.aqi}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className={`text-xl font-semibold capitalize ${aqiInfo.textColor} mb-4`}
          >
            {airQuality.level.replace('-', ' ')}
          </motion.div>

          {/* AQI Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${aqiPercentage}%` }}
              transition={{ delay: 1.6, duration: 1.0, ease: 'easeOut' }}
              className={`h-full ${aqiInfo.progressColor} rounded-full relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
            </motion.div>
          </motion.div>

          {/* Health Recommendation */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className={`${aqiInfo.textColor} text-center max-w-lg mx-auto`}
          >
            {airQuality.healthRecommendation}
          </motion.p>
        </div>

        {/* Pollutant Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="bg-white bg-opacity-70 rounded-xl p-6"
        >
          <h3 className={`text-lg font-semibold ${aqiInfo.textColor} mb-4`}>
            Pollutant Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(airQuality.pollutants)
              .filter(([_, value]) => value > 0)
              .map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-sm text-gray-600 mb-1">
                    {formatPollutantName(key)}
                  </div>
                  <div className={`text-lg font-bold ${aqiInfo.textColor}`}>
                    {value.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getPollutantUnit(key)}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* AQI Scale Reference */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="text-sm text-gray-600 mb-2">AQI Scale Reference:</div>
          <div className="flex flex-wrap gap-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs">Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-xs">Moderate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-xs">Unhealthy for Sensitive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs">Unhealthy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-xs">Very Unhealthy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-700 rounded"></div>
              <span className="text-xs">Hazardous</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AirQualityCard;
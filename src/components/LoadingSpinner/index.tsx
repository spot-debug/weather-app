import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Fetching weather data...',
  size = 'large'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-16 h-16';
      case 'medium':
        return 'w-24 h-24';
      case 'large':
        return 'w-32 h-32';
      default:
        return 'w-32 h-32';
    }
  };

  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'medium':
        return 'w-12 h-12';
      case 'large':
        return 'w-16 h-16';
      default:
        return 'w-16 h-16';
    }
  };

  const weatherIcons = ['☀️', '⛅', '☁️', '🌧️', '⛈️', '❄️'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
      >
        {/* Animated Weather Icons */}
        <div className={`relative ${getSizeClasses()} mx-auto mb-6`}>
          {weatherIcons.map((icon, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-center text-4xl"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{
                rotate: 360,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: index * 0.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transform: `rotate(${index * 60}deg) translateY(0px)`,
              }}
            >
              {icon}
            </motion.div>
          ))}

          {/* Central Spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className={`${getSpinnerSize()} border-4 border-blue-200 border-t-blue-600 rounded-full`}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Loading Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {message}
          </h3>
          <motion.div
            className="flex justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Progress Dots */}
        <motion.div
          className="mt-4 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {['Getting location', 'Fetching weather', 'Analyzing data', 'Almost done'].map((step, index) => (
            <motion.div
              key={step}
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.5 }}
            >
              <motion.div
                className="w-2 h-2 bg-blue-600 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  delay: index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <span className="ml-2 text-xs text-gray-600">{step}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Cancel Hint */}
        <motion.p
          className="mt-4 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          This should only take a moment...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Loading skeleton for weather cards
export const WeatherCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="weather-card max-w-2xl mx-auto"
  >
    <div className="animate-pulse">
      {/* Location skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>

      {/* Weather icon skeleton */}
      <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto mb-4"></div>

      {/* Temperature skeleton */}
      <div className="h-16 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>

      {/* Description skeleton */}
      <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>

      {/* Details skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  </motion.div>
);

// Loading skeleton for metrics
export const MetricsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-6xl mx-auto px-4 py-8">
    {[...Array(6)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="weather-metric"
      >
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-12 mx-auto mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Loading skeleton for forecast
export const ForecastSkeleton: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="flex gap-4 overflow-x-auto">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="weather-metric min-w-[140px]"
          >
            <div className="h-6 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-8 mx-auto mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-8 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
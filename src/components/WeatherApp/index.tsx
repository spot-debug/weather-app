import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getCompleteWeatherData } from '../../services/weatherApi';
import { Location, TemperatureUnit } from '../../types/weather';

// Import components
import SearchBar from '../SearchBar';
import WeatherCard from '../WeatherCard';
import WeatherDisplay from '../WeatherDisplay';
import AirQualityCard from '../AirQualityCard';
import WeatherForecast from '../WeatherForecast';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';

const WeatherApp: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [error, setError] = useState<string | null>(null);

  // Load temperature unit preference from localStorage
  useEffect(() => {
    const savedUnit = localStorage.getItem('temperatureUnit') as TemperatureUnit;
    if (savedUnit && (savedUnit === 'celsius' || savedUnit === 'fahrenheit')) {
      setTemperatureUnit(savedUnit);
    }
  }, []);

  // Save temperature unit preference to localStorage
  useEffect(() => {
    localStorage.setItem('temperatureUnit', temperatureUnit);
  }, [temperatureUnit]);

  // Query for weather data
  const {
    data: weatherData,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ['weatherData', selectedLocation, temperatureUnit],
    queryFn: () => {
      if (!selectedLocation) throw new Error('No location selected');
      return getCompleteWeatherData(selectedLocation, temperatureUnit === 'celsius' ? 'metric' : 'imperial');
    },
    enabled: !!selectedLocation,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on certain errors
      if (error instanceof Error && (
        error.message.includes('Invalid API key') ||
        error.message.includes('Location not found')
      )) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setError(null);
  };

  // Handle temperature unit toggle
  const handleToggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  // Handle error retry
  const handleRetry = () => {
    setError(null);
    if (refetch) {
      refetch();
    }
  };

  // Handle error dismissal
  const handleDismissError = () => {
    setError(null);
  };

  // Update error state when query error occurs
  useEffect(() => {
    if (queryError) {
      setError(queryError instanceof Error ? queryError.message : 'Failed to fetch weather data');
    }
  }, [queryError]);

  // Get initial location (user's location or default)
  useEffect(() => {
    const getInitialLocation = async () => {
      try {
        // Try to get user's geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const location: Location = {
                name: 'Your Location',
                country: 'Unknown',
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              };
              setSelectedLocation(location);
            },
            async (geoError) => {
              console.warn('Geolocation denied, using default location:', geoError);
              // Fallback to a default location (Delhi)
              const defaultLocation: Location = {
                name: 'Delhi',
                country: 'India',
                lat: 28.6139,
                lon: 77.2090,
              };
              setSelectedLocation(defaultLocation);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // 5 minutes
            }
          );
        } else {
          // Fallback to default location if geolocation not supported
          const defaultLocation: Location = {
            name: 'Delhi',
            country: 'India',
            lat: 28.6139,
            lon: 77.2090,
          };
          setSelectedLocation(defaultLocation);
        }
      } catch (error) {
        console.error('Error getting initial location:', error);
        setError('Unable to get your location. Please search manually.');
      }
    };

    getInitialLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-8 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-2"
          >
            Weather App
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600"
          >
            Get comprehensive weather information for any location
          </motion.p>
        </div>
      </motion.header>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <SearchBar
          onLocationSelect={handleLocationSelect}
          loading={isLoading}
          error={error}
        />
      </motion.div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {isLoading && selectedLocation && (
            <LoadingSpinner message="Fetching weather data..." />
          )}

          {error && !isLoading && (
            <ErrorMessage
              message={error}
              onRetry={handleRetry}
              onDismiss={handleDismissError}
            />
          )}

          {weatherData && !isLoading && !error && (
            <motion.div
              key={weatherData.location.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Weather Card */}
              <section className="mb-8">
                <WeatherCard
                  weatherData={weatherData}
                  temperatureUnit={temperatureUnit}
                  onToggleUnit={handleToggleTemperatureUnit}
                />
              </section>

              {/* Weather Forecast */}
              <section className="mb-8">
                <WeatherForecast
                  forecast={weatherData.forecast}
                  temperatureUnit={temperatureUnit}
                />
              </section>

              {/* Detailed Weather Metrics */}
              <section className="mb-8">
                <WeatherDisplay
                  weatherData={weatherData}
                  temperatureUnit={temperatureUnit}
                />
              </section>

              {/* Air Quality */}
              <section className="mb-8">
                <AirQualityCard
                  airQuality={weatherData.airQuality}
                />
              </section>

              {/* Footer Info */}
              <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-center py-8 text-sm text-gray-600"
              >
                <p>
                  Data provided by{' '}
                  <a
                    href="https://openweathermap.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    OpenWeatherMap
                  </a>
                  {' '}and{' '}
                  <a
                    href="https://geoapify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Geoapify
                  </a>
                </p>
                <p className="mt-2">
                  Last updated: {new Date(weatherData.lastUpdated).toLocaleString()}
                </p>
              </motion.footer>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State (no location selected) */}
        {!selectedLocation && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🌤️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome to Weather App
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Search for any location by city name, country, or pincode to get detailed weather information.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>🌡️</span>
                <span>Temperature & Feels Like</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💧</span>
                <span>Humidity & Rain Chance</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌬️</span>
                <span>Wind & Air Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>5-Day Forecast</span>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default WeatherApp;
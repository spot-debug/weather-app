import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { searchLocation, getUserLocation, validateSearchInput, Location } from '../../services/geocodingApi';

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
  loading?: boolean;
  error?: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, loading = false, error = null }) => {
  const [query, setQuery] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setInputError(null);

    // Validate input
    const validation = validateSearchInput(query);
    if (!validation.isValid) {
      setInputError(validation.error!);
      return;
    }

    try {
      const locations = await searchLocation(query.trim());
      if (locations.length > 0) {
        // Use the first/most relevant result
        onLocationSelect(locations[0]);
        setQuery('');
      }
    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Search failed. Please try again.');
    }
  };

  const handleQuickLocation = async (locationQuery: string) => {
    setInputError(null);
    try {
      const locations = await searchLocation(locationQuery);
      if (locations.length > 0) {
        onLocationSelect(locations[0]);
      }
    } catch (error) {
      setInputError(error instanceof Error ? error.message : 'Search failed. Please try again.');
    }
  };

  const handleUseMyLocation = async () => {
    setIsLocationLoading(true);
    setInputError(null);

    try {
      const userLocation = await getUserLocation();
      if (userLocation) {
        onLocationSelect(userLocation);
      } else {
        setInputError('Unable to get your location. Please enable location services or search manually.');
      }
    } catch (error) {
      setInputError('Failed to get your location. Please search manually.');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Clear error when user starts typing
    if (inputError) {
      setInputError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter pincode or country name..."
            disabled={loading || isLocationLoading}
            className={`search-input flex-1 ${error || inputError ? 'border-red-500 focus:ring-red-500' : ''}`}
            aria-label="Search location"
          />
          <button
            type="submit"
            disabled={loading || isLocationLoading || !query.trim()}
            className="search-button disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Error Messages */}
        {(error || inputError) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-red-600 text-sm text-center"
          >
            {error || inputError}
          </motion.div>
        )}
      </form>

      {/* Quick Location Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuickLocation('Delhi, India')}
          disabled={loading || isLocationLoading}
          className="px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delhi
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuickLocation('New York, USA')}
          disabled={loading || isLocationLoading}
          className="px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          New York
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleQuickLocation('London, UK')}
          disabled={loading || isLocationLoading}
          className="px-4 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          London
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUseMyLocation}
          disabled={loading || isLocationLoading}
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {isLocationLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Getting Location...
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Use My Location
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
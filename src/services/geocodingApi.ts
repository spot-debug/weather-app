import axios from 'axios';
import { GeocodingResponse, Location } from '../types/weather';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || 'demo_key';
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';

const GEOAPIFY_BASE_URL = 'https://api.geoapify.com/v1';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Enhanced axios instance with better error handling
const geocodingApi = axios.create({
  timeout: 10000,
});

const openWeatherGeoApi = axios.create({
  baseURL: OPENWEATHER_GEO_URL,
  timeout: 10000,
});

export const searchLocation = async (query: string): Promise<Location[]> => {
  if (!query || query.trim().length < 2) {
    throw new Error('Please enter at least 2 characters to search.');
  }

  try {
    // Try Geoapify first (better for postal codes)
    try {
      const geoapifyResponse = await geocodingApi.get<GeocodingResponse>(`${GEOAPIFY_BASE_URL}/postcode/search`, {
        params: {
          text: query.trim(),
          apiKey: GEOAPIFY_API_KEY,
          limit: 5,
        },
      });

      if (geoapifyResponse.data.results.length > 0) {
        return geoapifyResponse.data.results.map(result => ({
          name: result.city || result.formatted.split(',')[0] || 'Unknown',
          country: result.country,
          lat: result.lat,
          lon: result.lon,
          pincode: result.postcode,
        }));
      }
    } catch (geoapifyError) {
      console.warn('Geoapify failed, trying OpenWeatherMap:', geoapifyError);
    }

    // Fallback to OpenWeatherMap Geocoding
    try {
      const openWeatherResponse = await openWeatherGeoApi.get('/direct', {
        params: {
          q: query.trim(),
          appid: OPENWEATHER_API_KEY,
          limit: 5,
        },
      });

      if (openWeatherResponse.data.length > 0) {
        return openWeatherResponse.data.map(result => ({
          name: result.name,
          country: result.country,
          lat: result.lat,
          lon: result.lon,
        }));
      }
    } catch (openWeatherError) {
      console.warn('OpenWeatherMap geocoding failed:', openWeatherError);
    }

    throw new Error('Location not found. Please try a different search term.');

  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      if (error.response?.status >= 500) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to search location. Please try again.');
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<Location | null> => {
  try {
    // Try OpenWeatherMap reverse geocoding first
    try {
      const response = await openWeatherGeoApi.get('/reverse', {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          limit: 1,
        },
      });

      if (response.data.length > 0) {
        const result = response.data[0];
        return {
          name: result.name,
          country: result.country,
          lat,
          lon,
        };
      }
    } catch (error) {
      console.warn('OpenWeatherMap reverse geocoding failed:', error);
    }

    // Try Geoapify reverse geocoding as fallback
    try {
      const response = await geocodingApi.get(`${GEOAPIFY_BASE_URL}/reverse`, {
        params: {
          lat,
          lon,
          apiKey: GEOAPIFY_API_KEY,
        },
      });

      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          name: result.city || result.formatted.split(',')[0] || 'Unknown',
          country: result.country,
          lat,
          lon,
          pincode: result.postcode,
        };
      }
    } catch (error) {
      console.warn('Geoapify reverse geocoding failed:', error);
    }

    return null;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
};

export const getUserLocation = async (): Promise<Location | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const location = await reverseGeocode(position.coords.latitude, position.coords.longitude);
          resolve(location);
        } catch (error) {
          console.error('Failed to reverse geocode user location:', error);
          // Return coordinates even if reverse geocoding fails
          resolve({
            name: 'Your Location',
            country: 'Unknown',
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

export const validateSearchInput = (input: string): { isValid: boolean; error?: string } => {
  if (!input || input.trim().length === 0) {
    return { isValid: false, error: 'Please enter a location to search.' };
  }

  if (input.trim().length < 2) {
    return { isValid: false, error: 'Please enter at least 2 characters.' };
  }

  if (input.trim().length > 100) {
    return { isValid: false, error: 'Search query is too long. Please enter a shorter search term.' };
  }

  // Allow letters, numbers, spaces, commas, hyphens, and apostrophes
  const validPattern = /^[a-zA-Z0-9\s,\-'.]+$/;
  if (!validPattern.test(input.trim())) {
    return {
      isValid: false,
      error: 'Invalid characters. Please use letters, numbers, spaces, commas, hyphens, and apostrophes only.'
    };
  }

  return { isValid: true };
};
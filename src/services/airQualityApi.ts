import axios from 'axios';
import { AirQualityData } from '../types/weather';

const WEATHERBIT_API_KEY = import.meta.env.VITE_WEATHERBIT_API_KEY || 'demo_key';
const WEATHERBIT_BASE_URL = 'https://api.weatherbit.io/v2.0';

const weatherbitApi = axios.create({
  baseURL: WEATHERBIT_BASE_URL,
  timeout: 10000,
});

export const getAirQualityFromWeatherbit = async (lat: number, lon: number): Promise<AirQualityData | null> => {
  try {
    const response = await weatherbitApi.get('/current/air_quality', {
      params: {
        lat,
        lon,
        key: WEATHERBIT_API_KEY,
      },
    });

    const data = response.data.data[0];
    if (!data) {
      return null;
    }

    const aqi = data.aqi;
    let level: AirQualityData['level'];
    let color: string;
    let healthRecommendation: string;

    // Weatherbit uses US AQI scale (0-500)
    if (aqi <= 50) {
      level = 'good';
      color = '#00e400';
      healthRecommendation = 'Air quality is satisfactory. Enjoy your outdoor activities.';
    } else if (aqi <= 100) {
      level = 'moderate';
      color = '#ffff00';
      healthRecommendation = 'Air quality is acceptable for most people. Sensitive individuals may experience minor issues.';
    } else if (aqi <= 150) {
      level = 'unhealthy-sensitive';
      color = '#ff7e00';
      healthRecommendation = 'Sensitive groups should reduce prolonged outdoor exertion.';
    } else if (aqi <= 200) {
      level = 'unhealthy';
      color = '#ff0000';
      healthRecommendation = 'Everyone should reduce prolonged outdoor exertion.';
    } else if (aqi <= 300) {
      level = 'very-unhealthy';
      color = '#8f3f97';
      healthRecommendation = 'Avoid prolonged outdoor exertion. Everyone should stay indoors.';
    } else {
      level = 'hazardous';
      color = '#7e0023';
      healthRecommendation = 'Emergency conditions. Everyone should avoid outdoor activities.';
    }

    return {
      aqi,
      level,
      color,
      healthRecommendation,
      pollutants: {
        co: data.co || 0,
        no: data.no || 0,
        no2: data.no2 || 0,
        o3: data.o3 || 0,
        so2: data.so2 || 0,
        pm2_5: data.pm25 || 0,
        pm10: data.pm10 || 0,
        nh3: data.nh3 || 0,
      },
      trend: 'stable', // Weatherbit doesn't provide trend data
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error('Invalid Weatherbit API key');
      } else if (error.response?.status === 429) {
        console.error('Weatherbit API rate limit exceeded');
      }
    }
    console.warn('Failed to fetch air quality from Weatherbit:', error);
    return null;
  }
};

// Calculate AQI from pollutant concentrations (if needed for custom calculations)
export const calculateAQI = (pollutants: {
  pm2_5: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}): number => {
  // This is a simplified AQI calculation
  // In production, you'd want to use the full EPA AQI calculation formula

  const { pm2_5, pm10, o3, no2, so2, co } = pollutants;

  // Breakpoint concentrations for PM2.5 (24-hour average)
  const pm25Breakpoints = [
    { cLow: 0, cHigh: 12, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
  ];

  // Calculate AQI for each pollutant
  const calculateSubAQI = (concentration: number, breakpoints: typeof pm25Breakpoints): number => {
    for (const bp of breakpoints) {
      if (concentration >= bp.cLow && concentration <= bp.cHigh) {
        return Math.round(
          ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.iLow
        );
      }
    }
    return 500; // Max AQI if beyond breakpoints
  };

  const aqiValues = [
    calculateSubAQI(pm2_5, pm25Breakpoints),
    // Add more pollutant calculations as needed
  ];

  return Math.max(...aqiValues);
};

export const getHealthRecommendations = (aqi: number): string => {
  if (aqi <= 50) {
    return 'Air quality is satisfactory. Enjoy your outdoor activities.';
  } else if (aqi <= 100) {
    return 'Air quality is acceptable for most people. Sensitive individuals may experience minor issues.';
  } else if (aqi <= 150) {
    return 'Sensitive groups should reduce prolonged outdoor exertion.';
  } else if (aqi <= 200) {
    return 'Everyone should reduce prolonged outdoor exertion.';
  } else if (aqi <= 300) {
    return 'Avoid prolonged outdoor exertion. Everyone should stay indoors.';
  } else {
    return 'Emergency conditions. Everyone should avoid outdoor activities.';
  }
};
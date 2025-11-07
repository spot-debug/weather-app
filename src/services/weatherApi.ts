import axios from 'axios';
import { OpenWeatherResponse, OpenWeatherForecastResponse, AirPollutionResponse, WeatherData, CurrentWeather, WeatherForecast, Location } from '../types/weather';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApi = axios.create({
  baseURL: OPENWEATHER_BASE_URL,
  timeout: 10000,
});

export const getCurrentWeather = async (lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<CurrentWeather> => {
  try {
    const response = await weatherApi.get<OpenWeatherResponse>('/weather', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units,
      },
    });

    const data = response.data;
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000, // Convert to km
      uvIndex: 0, // UV index requires separate API call
      icon: data.weather[0].icon,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      }
      if (error.response?.status === 404) {
        throw new Error('Location not found. Please try a different search.');
      }
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
    }
    throw new Error('Failed to fetch weather data. Please check your connection.');
  }
};

export const getWeatherForecast = async (lat: number, lon: number, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherForecast[]> => {
  try {
    const response = await weatherApi.get<OpenWeatherForecastResponse>('/forecast', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units,
        cnt: 40, // 5 days * 8 intervals (3-hour intervals)
      },
    });

    const data = response.data;

    // Group forecasts by day
    const dailyForecasts = new Map<string, any[]>();

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!dailyForecasts.has(dateKey)) {
        dailyForecasts.set(dateKey, []);
      }
      dailyForecasts.get(dateKey)!.push(item);
    });

    // Convert to WeatherForecast format
    const forecasts: WeatherForecast[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    Array.from(dailyForecasts.entries()).slice(0, 5).forEach(([dateKey, dayData]) => {
      const date = new Date(dateKey);
      const dayName = date.toDateString() === new Date().toDateString() ? 'Today' : dayNames[date.getDay()];

      // Calculate daily averages
      const temps = dayData.map(item => item.main.temp);
      const humidity = dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length;
      const windSpeed = dayData.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.length;
      const rainChance = Math.max(...dayData.map(item => item.pop * 100));

      // Get most common weather condition
      const conditions = dayData.map(item => item.weather[0].main);
      const mainCondition = conditions.sort((a, b) =>
        conditions.filter(v => v === a).length - conditions.filter(v => v === b).length
      ).pop() || 'Clear';

      const mainDescription = dayData.find(item => item.weather[0].main === mainCondition)?.weather[0].description || 'clear sky';
      const icon = dayData.find(item => item.weather[0].main === mainCondition)?.weather[0].icon || '01d';

      forecasts.push({
        date: dateKey,
        dayName,
        temperature: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
          avg: Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length),
        },
        condition: mainCondition,
        description: mainDescription,
        humidity: Math.round(humidity),
        windSpeed: Math.round(windSpeed),
        rainChance: Math.round(rainChance),
        icon,
      });
    });

    return forecasts;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
      }
      if (error.response?.status === 404) {
        throw new Error('Location not found. Please try a different search.');
      }
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
    }
    throw new Error('Failed to fetch weather forecast. Please check your connection.');
  }
};

export const getAirQuality = async (lat: number, lon: number) => {
  try {
    const response = await weatherApi.get<AirPollutionResponse>('/air_pollution', {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
      },
    });

    const data = response.data.list[0]; // Get current air quality
    const aqi = data.main.aqi;

    let level: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
    let color: string;
    let healthRecommendation: string;

    switch (aqi) {
      case 1:
        level = 'good';
        color = '#00e400';
        healthRecommendation = 'Air quality is satisfactory. Enjoy your outdoor activities.';
        break;
      case 2:
        level = 'moderate';
        color = '#ffff00';
        healthRecommendation = 'Air quality is acceptable for most people. Sensitive individuals may experience minor issues.';
        break;
      case 3:
        level = 'unhealthy-sensitive';
        color = '#ff7e00';
        healthRecommendation = 'Sensitive groups should reduce prolonged outdoor exertion.';
        break;
      case 4:
        level = 'unhealthy';
        color = '#ff0000';
        healthRecommendation = 'Everyone should reduce prolonged outdoor exertion.';
        break;
      case 5:
        level = 'very-unhealthy';
        color = '#8f3f97';
        healthRecommendation = 'Avoid prolonged outdoor exertion. Everyone should stay indoors.';
        break;
      default:
        level = 'hazardous';
        color = '#7e0023';
        healthRecommendation = 'Emergency conditions. Everyone should avoid outdoor activities.';
    }

    return {
      aqi: aqi * 50, // Convert to US AQI scale (0-500)
      level,
      color,
      healthRecommendation,
      pollutants: {
        co: data.components.co,
        no: data.components.no,
        no2: data.components.no2,
        o3: data.components.o3,
        so2: data.components.so2,
        pm2_5: data.components.pm2_5,
        pm10: data.components.pm10,
        nh3: data.components.nh3,
      },
      trend: 'stable' as const, // Would need historical data for accurate trend
    };
  } catch (error) {
    console.warn('Failed to fetch air quality data:', error);
    return null;
  }
};

export const getCompleteWeatherData = async (location: Location, units: 'metric' | 'imperial' = 'metric'): Promise<WeatherData> => {
  try {
    const [currentWeather, forecast, airQuality] = await Promise.all([
      getCurrentWeather(location.lat, location.lon, units),
      getWeatherForecast(location.lat, location.lon, units),
      getAirQuality(location.lat, location.lon),
    ]);

    return {
      location,
      current: currentWeather,
      forecast,
      airQuality,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    throw error;
  }
};
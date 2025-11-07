export interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
  pincode?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  icon: string;
}

export interface WeatherForecast {
  date: string;
  dayName: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  icon: string;
}

export interface AirQualityData {
  aqi: number;
  level: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  color: string;
  healthRecommendation: string;
  pollutants: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  trend: 'improving' | 'worsening' | 'stable';
}

export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  forecast: WeatherForecast[];
  airQuality: AirQualityData | null;
  lastUpdated: string;
}

export interface SearchHistoryItem {
  query: string;
  location: Location;
  timestamp: number;
}

export interface ApiResponseError {
  message: string;
  code?: number;
  details?: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

// API Response interfaces
export interface OpenWeatherResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface GeocodingResponse {
  results: Array<{
    country: string;
    country_code: string;
    state?: string;
    county?: string;
    city?: string;
    postcode?: string;
    district?: string;
    suburb?: string;
    street?: string;
    housenumber?: string;
    lon: number;
    lat: number;
    formatted: string;
    address_line1?: string;
    address_line2?: string;
    category: string;
    type: string;
    datasource: {
      sourcename: string;
      attribution: string;
      license: string;
    };
    place_id: string;
    rank: {
      importance: number;
      popularity: number;
      confidence: number;
      match_type: string;
    };
  }>;
  query: {
    text: string;
  };
}

export interface AirPollutionResponse {
  coord: { lon: number; lat: number };
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }>;
}
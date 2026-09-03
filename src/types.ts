export interface AQIComponents {
  pm2_5: number;
  pm10: number;
  co: number; // carbon monoxide
  o3: number; // ozone
  no2: number; // nitrogen dioxide
  so2: number; // sulphur dioxide
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface AirVistaData {
  locationName: string;
  latitude: number;
  longitude: number;
  aqi: number;
  airVistaScore: number;
  status: 'Baik' | 'Sedang' | 'Tidak Sehat' | 'Sangat Tidak Sehat' | 'Berbahaya';
  components: AQIComponents;
  weather: WeatherData;
  lastUpdated: string;
}

export interface CityInfo {
  name: string;
  province: string;
  latitude: number;
  longitude: number;
}

export interface AIRecommendation {
  sportsSafety: string;
  maskRequired: string;
  childSafety: string;
  elderlySafety: string;
  generalAdvise: string;
  bestOutdoorHours: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ComparisonResult {
  cityA: AirVistaData;
  cityB: AirVistaData;
}

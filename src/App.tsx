import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LocationBar from './components/LocationBar';
import Dashboard from './components/Dashboard';
import AirQualityMap from './components/AirQualityMap';
import TrendAnalysis from './components/TrendAnalysis';
import AIConsultation from './components/AIConsultation';
import CityComparison from './components/CityComparison';
import AboutPlatform from './components/AboutPlatform';
import { AirVistaData } from './types';
import { INDONESIAN_CITIES } from './utils/cities';
import { Loader2, AlertCircle, Wind, Volume2, HardDrive } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentCity, setCurrentCity] = useState('Jakarta Pusat');
  const [activeData, setActiveData] = useState<AirVistaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enforce global dark mode class on root HTML element strictly
  useEffect(() => {
    window.document.documentElement.classList.add('dark');
  }, []);

  // Geolocation trigger on system startup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Scan closest Indonesian city to resolve label name
          let closestCity = INDONESIAN_CITIES[0];
          let minDistance = Infinity;

          INDONESIAN_CITIES.forEach((city) => {
            const dist = Math.pow(city.latitude - latitude, 2) + Math.pow(city.longitude - longitude, 2);
            if (dist < minDistance) {
              minDistance = dist;
              closestCity = city;
            }
          });

          const resolvedName = minDistance < 0.15 
            ? `${closestCity.name} [GPS]` 
            : `Lokasi GPS Terdeteksi`;

          handleLocationUpdate(resolvedName, latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation access rejected or timed out. Connecting to default station: Jakarta Pusat.");
          handleLocationUpdate('Jakarta Pusat', -6.186486, 106.834091);
        },
        { timeout: 7000 }
      );
    } else {
      handleLocationUpdate('Jakarta Pusat', -6.186486, 106.834091);
    }
  }, []);

  // Location selector modifier handler
  const handleLocationUpdate = (name: string, lat: number, lng: number) => {
    setIsLoading(true);
    fetch(`/api/aqi/data?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setActiveData(data);
        setCurrentCity(name);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("AirVista loader error:", err);
        // Fallback placeholder data if offline or remote systems rate-limit
        setActiveData({
          locationName: name,
          latitude: lat,
          longitude: lng,
          aqi: 68,
          airVistaScore: 49,
          status: 'Sedang',
          components: { pm2_5: 22.4, pm10: 38.0, co: 420, o3: 45, no2: 12, so2: 5 },
          weather: { temperature: 27.5, humidity: 82, windSpeed: 7.5 },
          lastUpdated: new Date().toISOString()
        });
        setCurrentCity(name);
        setIsLoading(false);
      });
  };

  // Switcher based on active selected tab routes
  const renderContent = () => {
    if (!activeData) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen text-slate-500">
          <Loader2 className="animate-spin text-sky-500 mb-3" size={32} />
          <span className="text-sm font-mono tracking-wider">Membuka terminal pelindung AirVista...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={activeData} isLoading={isLoading} />;
      case 'map':
        return <AirQualityMap activeData={activeData} onLocationChange={handleLocationUpdate} />;
      case 'trends':
        return <TrendAnalysis activeData={activeData} />;
      case 'ai-consult':
        return <AIConsultation activeData={activeData} />;
      case 'comparison':
        return <CityComparison activeData={activeData} />;
      case 'about':
        return <AboutPlatform />;
      default:
        return <Dashboard data={activeData} isLoading={isLoading} />;
    }
  };

  return (
    <div id="airvista-app-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-x-hidden">
      
      {/* Sidebar Nav */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main viewport frame */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        
        {/* Top universal sensor & locator selector controls overlay */}
        <LocationBar 
          currentCity={currentCity} 
          onLocationChange={handleLocationUpdate} 
          isLoading={isLoading} 
        />

        {/* Dynamic nested tab layout renderer */}
        <div className="flex-1 pb-12">
          {renderContent()}
        </div>

      </main>
    </div>
  );
}

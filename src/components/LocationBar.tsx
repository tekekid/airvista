import React, { useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { INDONESIAN_CITIES } from '../utils/cities';
import IndonesiaSearchCombobox from './IndonesiaSearchCombobox';

interface LocationBarProps {
  currentCity: string;
  onLocationChange: (name: string, lat: number, lng: number) => void;
  isLoading: boolean;
}

export default function LocationBar({ currentCity, onLocationChange, isLoading }: LocationBarProps) {
  const [geoLoading, setGeoLoading] = useState(false);

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung Geolocation.");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find closest city in our local database to name it appropriately
        let closestCity = INDONESIAN_CITIES[0];
        let minDistance = Infinity;

        INDONESIAN_CITIES.forEach((city) => {
          const dist = Math.pow(city.latitude - latitude, 2) + Math.pow(city.longitude - longitude, 2);
          if (dist < minDistance) {
            minDistance = dist;
            closestCity = city;
          }
        });

        // If distance is very close (under 0.25 deg, approx 25km), use that city name, otherwise map name
        const displayName = minDistance < 0.15 
          ? `${closestCity.name} [GPS]` 
          : `Garis Lintang GPS (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;

        onLocationChange(displayName, latitude, longitude);
        setGeoLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Gagal mendeteksi lokasi otomatis. Silakan pilih kota secara manual.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div id="airvista-top-locationbar" className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6 bg-slate-950/70 border-b border-slate-900 sticky top-0 z-30 backdrop-blur-lg">
      
      {/* Current Location Indicator with glowing active pulse */}
      <div className="flex items-center gap-3">
        <div className="relative p-2.5 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/15">
          <MapPin size={18} className="animate-pulse" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase block">Stasiun Deteksi Udara</span>
          <h2 className="text-sm md:text-base font-display font-semibold text-slate-100 flex items-center gap-2">
            <span>{currentCity}</span>
            {isLoading && <Loader2 size={13} className="animate-spin text-sky-400" />}
          </h2>
        </div>
      </div>

      {/* Reusable premium combobox + Geolocation trigger side-by-side */}
      <div className="flex flex-1 max-w-lg items-center gap-2.5">
        <div className="flex-1">
          <IndonesiaSearchCombobox 
            onSelect={onLocationChange} 
            placeholder="Cari Kota, Kabupaten, Kecamatan..." 
          />
        </div>

        {/* Use Geolocation Trigger */}
        <button
          id="btn-use-geolocation-bar"
          onClick={handleUseGeolocation}
          disabled={geoLoading}
          className="flex items-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-650 disabled:bg-sky-500/40 text-xs md:text-sm font-semibold text-white rounded-xl shadow-lg shadow-sky-500/10 cursor-pointer transition-all shrink-0 active:scale-95"
        >
          {geoLoading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Navigation size={14} className="transform rotate-45" />
          )}
          <span className="hidden sm:inline">Lokasi Saya</span>
        </button>
      </div>
    </div>
  );
}

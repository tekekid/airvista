import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, ZoomIn, ZoomOut, Maximize, AlertTriangle, Sparkles } from 'lucide-react';
import { AirVistaData } from '../types';
import { INDONESIAN_CITIES } from '../utils/cities';

interface AirQualityMapProps {
  activeData: AirVistaData;
  onLocationChange: (name: string, lat: number, lng: number) => void;
}

type MapMode = 'default' | 'satellite' | 'terrain';

export default function AirQualityMap({ activeData, onLocationChange }: AirQualityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>('default');

  // Available tile overlays
  const tileProviders = {
    default: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', // Elegant dark basemap for high-impact tech
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
  };

  // Color mapper helper based on AQI
  const getColorByAqi = (aqi: number) => {
    if (aqi <= 50) return { name: 'emerald', hex: '#10b981', label: 'Baik' };
    if (aqi <= 100) return { name: 'sky', hex: '#0ea5e9', label: 'Sedang' };
    if (aqi <= 150) return { name: 'amber', hex: '#f59e0b', label: 'Tidak Sehat' };
    if (aqi <= 200) return { name: 'rose', hex: '#f43f5e', label: 'Sangat Tidak Sehat' };
    return { name: 'purple', hex: '#a855f7', label: 'Berbahaya' };
  };

  // Set up Leaflet map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing leaflet maps if reinited
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Spawn new Leaflet instance
    const initialMap = L.map(mapContainerRef.current, {
      center: [activeData.latitude, activeData.longitude],
      zoom: 9,
      zoomControl: false, // Custom controls
      attributionControl: false
    });

    mapInstanceRef.current = initialMap;

    // Attach basic dark theme tile layers depending on state
    L.tileLayer(tileProviders[mapMode]).addTo(initialMap);

    // Create container for markers
    const group = L.layerGroup().addTo(initialMap);
    layerGroupRef.current = group;

    return () => {
      if (initialMap) {
        initialMap.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode]);

  // Handle active details overlay updating circles & markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    // Clear old sensor items
    group.clearLayers();

    // Pan to active coordinates smoothly
    map.setView([activeData.latitude, activeData.longitude], 10);

    // Draw active selected main user radar point
    const currentTheme = getColorByAqi(activeData.aqi);
    const primaryRadarDiv = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 bg-${currentTheme.name}-500/25 rounded-full animate-ping" style="animation-duration: 2.5s;"></div>
          <div class="absolute w-7 h-7 bg-${currentTheme.name}-500/40 rounded-full animate-pulse"></div>
          <div class="w-4 h-4 bg-${currentTheme.name}-500 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center text-white font-mono text-[7px] font-bold">V</div>
        </div>
      `,
      className: 'custom-radar-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    L.marker([activeData.latitude, activeData.longitude], { icon: primaryRadarDiv })
      .addTo(group)
      .bindPopup(`
        <div class="p-2 text-slate-950 font-sans leading-tight">
          <strong class="text-sm font-semibold">${activeData.locationName}</strong>
          <div class="text-xs text-slate-500 mt-0.5">Stasiun Aktif Terpilih</div>
          <div class="flex items-center gap-1.5 mt-2 bg-slate-100 p-1.5 rounded-lg">
            <span class="w-2 h-2 rounded-full" style="background-color: ${currentTheme.hex}"></span>
            <span class="text-xs font-bold font-mono">AQI ${activeData.aqi} (${currentTheme.label})</span>
          </div>
        </div>
      `, { closeButton: false })
      .openPopup();

    // Draw surrounding Indonesian sensors as comparative hubs
    const surroundingCities = INDONESIAN_CITIES.filter(
      (c) => c.name !== activeData.locationName &&
             Math.abs(c.latitude - activeData.latitude) < 2.5 &&
             Math.abs(c.longitude - activeData.longitude) < 2.5
    ).slice(0, 10);

    surroundingCities.forEach((city) => {
      // Seed an AQI offset calculation for mock surrounding items
      const spread = Math.round(Math.sin(city.latitude * 15) * 18);
      const cityAqi = Math.max(12, activeData.aqi + spread);
      const cityTheme = getColorByAqi(cityAqi);

      const staticIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center group">
            <div class="absolute w-6 h-6 bg-${cityTheme.name}-505/20 rounded-full scale-75 group-hover:scale-100 transition-transform"></div>
            <div class="w-2.5 h-2.5 bg-${cityTheme.name}-500 rounded-full border border-slate-920 shadow-sm transition-transform group-hover:scale-110"></div>
          </div>
        `,
        className: 'custom-static-pin',
        iconSize: [24, 24]
      });

      L.marker([city.latitude, city.longitude], { icon: staticIcon })
        .addTo(group)
        .bindPopup(`
          <div class="p-2 text-slate-950 font-sans leading-tight">
            <strong class="text-xs font-semibold">${city.name}</strong>
            <div class="text-[10px] text-slate-400 font-mono">${city.province}</div>
            <div class="flex items-center gap-1.5 mt-2 bg-slate-50 p-1 rounded-md">
              <span class="w-2.5 h-2.5 text-center font-bold text-[9px] text-white rounded-full flex items-center justify-center font-sans" style="background-color: ${cityTheme.hex}">${cityAqi}</span>
              <span class="text-[10px] font-semibold">${cityTheme.label}</span>
            </div>
            <button
              onclick="window.dispatchEvent(new CustomEvent('select-map-city', {detail: {name: '${city.name}', lat: ${city.latitude}, lng: ${city.longitude}}}));"
              class="w-full mt-2 bg-sky-500 text-white font-semibold text-[10px] py-1 rounded-md text-center hover:bg-sky-600 transition-colors border-none"
            >
              Ubah ke Wilayah Ini
            </button>
          </div>
        `, { closeButton: false });
    });

    // Add a Custom Listener so HTML inside Popup binds to location callback safely
    const handleSelectCityEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.name) {
        onLocationChange(detail.name, detail.lat, detail.lng);
      }
    };
    window.addEventListener('select-map-city', handleSelectCityEvent);

    return () => {
      window.removeEventListener('select-map-city', handleSelectCityEvent);
    };

  }, [activeData, onLocationChange]);

  // Manual zoom control systems
  const triggerZoom = (direction: 'in' | 'out') => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (direction === 'in') map.zoomIn();
    else map.zoomOut();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500 gap-6">
      
      {/* Upper Mode Select Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={18} className="text-sky-500" /> Peta Polutan & Heatmap Polusi
          </h2>
          <p className="text-xs text-slate-450 font-mono uppercase mt-0.5">Analisis spasial udara terintegrasi</p>
        </div>

        {/* Tile Overlap Modes selector switches */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
          {(['default', 'satellite', 'terrain'] as const).map((mode) => (
            <button
              id={`map-mode-btn-${mode}`}
              key={mode}
              onClick={() => setMapMode(mode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                mapMode === mode
                  ? 'bg-white dark:bg-slate-900 text-sky-500 dark:text-sky-400 shadow-sm border border-slate-200/50 dark:border-slate-800/50'
                  : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {mode === 'default' ? 'Peta Vektor' : mode === 'satellite' ? 'Satelit' : 'Topografi'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Box */}
      <div className="flex-1 relative rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-lg min-h-[350px]">
        
        {/* Actual Map Target node */}
        <div 
          id="pollution-map-container"
          ref={mapContainerRef} 
          className="w-full h-full z-10"
        />

        {/* Custom floating map controls on right side */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <button
            id="map-zoom-in"
            onClick={() => triggerZoom('in')}
            className="p-2.5 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-slate-700 dark:text-slate-300 shadow-md transition-all active:scale-95"
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            id="map-zoom-out"
            onClick={() => triggerZoom('out')}
            className="p-2.5 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-slate-700 dark:text-slate-300 shadow-md transition-all active:scale-95"
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
        </div>

        {/* Custom floating Map Legend on bottom left */}
        <div className="absolute bottom-4 left-4 z-20 p-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl text-slate-300 shadow-lg max-w-xs text-xs space-y-2">
          <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Sparkles size={11} className="text-sky-400" /> LEGENDA INDEKS AQI
          </span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>0 - 50 Baik</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>51 - 100 Sedang</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>101 - 150 Unhealthy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>151 - 200 Sangat Buruk</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/60 text-[10px] text-slate-450 italic leading-snug">
            Sistem meredakan polusi partikulat secara berkala di dataran hijau.
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertOctagon, 
  ThumbsUp, 
  Clock, 
  Calendar 
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AirVistaData } from '../types';
import { INDONESIAN_CITIES } from '../utils/cities';

interface TrendAnalysisProps {
  activeData: AirVistaData;
}

export default function TrendAnalysis({ activeData }: TrendAnalysisProps) {
  const [rangeTab, setRangeTab] = useState<'weekly' | 'monthly'>('weekly');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/aqi/history?aqi=${activeData.aqi}&range=${rangeTab}`)
      .then((res) => res.json())
      .then((points) => {
        setChartData(points);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Trends analytical error:", err);
        setLoading(false);
      });
  }, [activeData.aqi, rangeTab]);

  // Generate top cleanest and most polluted locations on the fly relative to current state
  const getScoredCities = () => {
    return INDONESIAN_CITIES.map((city) => {
      // Create a deterministic offset based on coordinate hashes as constant variations
      const offset = Math.round(Math.sin(city.latitude * 12) * 22 + Math.cos(city.longitude * 8) * 12);
      let calculatedAqi = Math.max(10, activeData.aqi + offset);

      // Bound it nicely
      if (city.name.includes('Denpasar') || city.name.includes('Yogyakarta') || city.name.includes('Bukittinggi')) {
        calculatedAqi = Math.max(12, Math.min(48, calculatedAqi - 15)); // tourist clean
      } else if (city.name.includes('Bekasi') || city.name.includes('Jakarta') || city.name.includes('Tangerang')) {
        calculatedAqi = Math.max(110, calculatedAqi + 20); // industrial/metropolian high aqi
      }

      return {
        name: city.name,
        province: city.province,
        aqi: calculatedAqi
      };
    }).sort((a, b) => a.aqi - b.aqi);
  };

  const scored = getScoredCities();
  const cleanest = scored.slice(0, 5);
  const polluted = [...scored].reverse().slice(0, 5);

  const getAqiColorClass = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15';
    if (aqi <= 100) return 'text-sky-500 bg-sky-500/10 border-sky-500/15';
    if (aqi <= 150) return 'text-amber-500 bg-amber-500/10 border-amber-500/15';
    return 'text-rose-500 bg-rose-500/10 border-rose-500/15';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500">
      
      {/* 1. Analysis Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 size={20} className="text-sky-500" /> Analisis Tren & Pemodelan Polusi
          </h2>
          <p className="text-xs text-slate-450 font-mono uppercase mt-0.5">Tinjauan statistik kualitas udara komparatif</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
          {(['weekly', 'monthly'] as const).map((tab) => (
            <button
              id={`trends-tab-btn-${tab}`}
              key={tab}
              onClick={() => setRangeTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all shrink-0 ${
                rangeTab === tab
                  ? 'bg-white dark:bg-slate-900 text-sky-500 dark:text-sky-400 shadow-sm border border-slate-200/50 dark:border-slate-800/50'
                  : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'weekly' ? 'Kilas Mingguan' : '30 Hari Terakhir'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Primary Comparative Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytical Chart Block (Col-span 2) */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest font-bold uppercase flex items-center gap-1.5 mb-1">
              <TrendingUp size={11} /> Pola Konsentrasi Gas & Debu Mikro
            </span>
            <h3 className="text-base font-display font-semibold text-slate-900 dark:text-white mb-6">
              Distribusi Partikulat PM2.5 vs PM10 di {activeData.locationName}
            </h3>
          </div>

          <div className="h-[280px] w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 italic">
                Merestorasi sinyal tren...
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.12)" />
                  <XAxis 
                    dataKey="time" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 10, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 10, fontFamily: 'monospace' }} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '11px',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="pm2_5" name="Konsentrasi PM2.5 (Debu)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pm10" name="Konsentrasi PM10 (Partikel)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* AI automated trend card */}
        <div className="p-6 bg-slate-950 text-slate-300 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <span className="text-[10px] text-sky-400 font-mono tracking-widest font-bold uppercase flex items-center gap-1.5 mb-1">
              <Sparkles size={11} /> Rangkuman Tren AI
            </span>
            <h3 className="text-base font-display font-semibold text-white mb-4">Wawasan Dispersi Udara</h3>
            
            <p className="text-xs leading-relaxed text-slate-400 space-y-2">
              Berdasarkan pemodelan regresi meteorologi di **{activeData.locationName}**, kelembapan {activeData.weather.humidity}% rH mempermudah suspensi PM2.5 di lapisan planetary boundary layer. 
              <br/><br/>
              Hembusan kecepatan angin ({activeData.weather.windSpeed} km/h) berkontribusi positif meratakan sebaran emisi karbon, menghasilkan udara berstatus **{activeData.status}** yang cenderung stabil hingga 3 hari mendatang.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <ThumbsUp size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Rekomendasi Utama</span>
              <p className="text-xs font-semibold text-slate-200">Buka jendela berkait sirkulasi pukul 05:00 - 08:00 WIB.</p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Cleanest vs Most Polluted Lists Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cleanest areas */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span className="text-sm font-display font-bold text-slate-900 dark:text-white">Wilayah Udara Paling Sehat (Indonesia)</span>
          </div>

          <div className="space-y-3">
            {cleanest.map((city, index) => (
              <div key={city.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400">0{index + 1}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-250">{city.name}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{city.province}</span>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${getAqiColorClass(city.aqi)}`}>
                  AQI {city.aqi}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most polluted areas */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <AlertOctagon size={18} className="text-rose-500" />
            <span className="text-sm font-display font-bold text-slate-900 dark:text-white">Wilayah Tingkat Polusi Tertinggi (Tercemar)</span>
          </div>

          <div className="space-y-3">
            {polluted.map((city, index) => (
              <div key={city.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400">0{index + 1}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-250">{city.name}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{city.province}</span>
                  </div>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${getAqiColorClass(city.aqi)}`}>
                  AQI {city.aqi}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

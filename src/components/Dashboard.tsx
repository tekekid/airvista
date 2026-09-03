import React, { useEffect, useState } from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Calendar, 
  Activity, 
  Gauge,
  Clock,
  ArrowUpRight,
  UserCheck,
  Heart,
  Baby,
  Users
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AirVistaData, AIRecommendation } from '../types';

interface DashboardProps {
  data: AirVistaData;
  isLoading: boolean;
}

export default function Dashboard({ data, isLoading }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load physical history based on active AQI and tab selected
  useEffect(() => {
    setIsHistoryLoading(true);
    fetch(`/api/aqi/history?aqi=${data.aqi}&range=${activeTab}`)
      .then((res) => res.json())
      .then((history) => {
        setHistoryData(history);
        setIsHistoryLoading(false);
      })
      .catch((err) => {
        console.error("History fetch error:", err);
        setIsHistoryLoading(false);
      });
  }, [data.aqi, activeTab]);

  // Load AI suggestions from the fullstack server
  useEffect(() => {
    setIsAiLoading(true);
    fetch('/api/gemini/recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationName: data.locationName,
        aqi: data.aqi,
        status: data.status,
        components: data.components,
        weather: data.weather
      })
    })
      .then((res) => res.json())
      .then((result) => {
        setRecommendation(result);
        setIsAiLoading(false);
      })
      .catch((err) => {
        console.error("AI fetch error:", err);
        setIsAiLoading(false);
      });
  }, [data.locationName, data.aqi]);

  // AQI Theme colors mapping
  const getThemeByStatus = (status: string) => {
    switch (status) {
      case 'Baik':
        return {
          bg: 'from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10',
          border: 'border-emerald-500/20 dark:border-emerald-500/30',
          text: 'text-emerald-500 dark:text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          gradientHex: '#10b981',
          shadow: 'shadow-emerald-500/5'
        };
      case 'Sedang':
        return {
          bg: 'from-sky-500/10 to-blue-500/5 dark:from-sky-500/20 dark:to-blue-500/10',
          border: 'border-sky-500/20 dark:border-sky-500/30',
          text: 'text-sky-500 dark:text-sky-400',
          badge: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
          gradientHex: '#0ea5e9',
          shadow: 'shadow-sky-500/5'
        };
      case 'Tidak Sehat':
        return {
          bg: 'from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-orange-500/10',
          border: 'border-amber-500/20 dark:border-amber-500/30',
          text: 'text-amber-500 dark:text-amber-400',
          badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          gradientHex: '#f59e0b',
          shadow: 'shadow-amber-500/5'
        };
      case 'Sangat Tidak Sehat':
        return {
          bg: 'from-rose-500/10 to-pink-500/5 dark:from-rose-500/20 dark:to-pink-500/10',
          border: 'border-rose-500/20 dark:border-rose-500/30',
          text: 'text-rose-500 dark:text-rose-400',
          badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
          gradientHex: '#f43f5e',
          shadow: 'shadow-rose-500/5'
        };
      default:
        return {
          bg: 'from-purple-500/10 to-violet-500/5 dark:from-purple-500/20 dark:to-violet-500/10',
          border: 'border-purple-500/20 dark:border-purple-500/30',
          text: 'text-purple-500 dark:text-purple-400',
          badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
          gradientHex: '#a855f7',
          shadow: 'shadow-purple-500/5'
        };
    }
  };

  const currentTheme = getThemeByStatus(data.status);

  // SVG parameters for AirVista circular progress
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.airVistaScore / 100) * circumference;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500">
      
      {/* 1. Hero Dynamic Section */}
      <div className={`p-6 md:p-8 rounded-3xl bg-gradient-to-br ${currentTheme.bg} border ${currentTheme.border} ${currentTheme.shadow} transition-all duration-300`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Hero Left: Index and Location */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-2.5 mb-3">
              <span className={`text-[11px] font-mono tracking-wider font-bold px-3 py-1 rounded-full border ${currentTheme.badge}`}>
                STATUS: {data.status.toUpperCase()}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock size={12} />
                Realtime
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight text-slate-900 dark:text-white mb-2">
              AQI {data.aqi}
            </h1>
            
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
              Kualitas udara saat ini di <span className="font-semibold text-slate-800 dark:text-slate-200">{data.locationName}</span> berada pada tingkat yang <span className={currentTheme.text + " font-semibold font-sans text-md"}>{data.status.toLowerCase()}</span>.
            </p>

            {/* Micro Weather Indicators */}
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <div className="p-1 px-1.5 bg-slate-100 dark:bg-slate-850 rounded-md">
                  <Thermometer size={14} className="inline text-rose-400" />
                </div>
                <span>{data.weather.temperature}°C</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <div className="p-1 px-1.5 bg-slate-100 dark:bg-slate-850 rounded-md">
                  <Droplets size={14} className="inline text-sky-400" />
                </div>
                <span>{data.weather.humidity}% rH</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <div className="p-1 px-1.5 bg-slate-100 dark:bg-slate-850 rounded-md">
                  <Wind size={14} className="inline text-emerald-400" />
                </div>
                <span>{data.weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          {/* Hero Middle: AirVista Score Progress Circle */}
          <div className="lg:col-span-4 flex flex-col items-center border-y lg:border-y-0 lg:border-x border-slate-250 dark:border-slate-800/80 py-6 lg:py-0">
            <div className="relative flex items-center justify-center w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Dynamic Glowing Progress Ring */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke={currentTheme.gradientHex}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              
              {/* Score text details */}
              <div className="absolute text-center">
                <span className="text-3xl font-display font-bold text-slate-900 dark:text-white">{data.airVistaScore}</span>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest font-semibold uppercase">Vista Score</p>
              </div>
            </div>
            <div className="text-center mt-3 max-w-xs">
              <span className="text-xs text-slate-400 font-medium">Skor kesehatan lingkungan menyeluruh. Indeks tinggi melambangkan kemurnian udara.</span>
            </div>
          </div>

          {/* Hero Right: Brief Environmental Summary Indicator */}
          <div className="lg:col-span-4 flex flex-col gap-4 text-left">
            <h3 className="text-xs font-mono tracking-wider font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1.5">
              <Activity size={14} className="text-sky-500" /> Indeks Ekosistem
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-105 dark:border-slate-850 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors">
                <span className="text-xs text-slate-500 dark:text-slate-450 font-medium">Beban Polutan Aktif</span>
                <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200">
                  {Math.round(data.aqi * 0.38)} μg/m³
                </span>
              </div>
              <div className="flex justify-between items-center bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-105 dark:border-slate-850 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors">
                <span className="text-xs text-slate-500 dark:text-slate-450 font-medium">Ambang Batas WHO</span>
                <span className="text-xs font-mono font-bold text-emerald-500">Optimal (Baik)</span>
              </div>
              <div className="flex justify-between items-center bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-105 dark:border-slate-850 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors">
                <span className="text-xs text-slate-500 dark:text-slate-450 font-medium">Status Pengasapan</span>
                <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200">Sirkulasi Lancar</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Pollutant Gas Grid (PM2.5, PM10, CO, O3, NO2, SO2) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono tracking-widest font-bold text-slate-450 uppercase flex items-center gap-2">
            <Gauge size={16} className="text-sky-500" /> Komponen Polutan Udara (Gas & Partikulat)
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Satuan: μg/m³ (kecuali CO ppm)</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Card Component pm2_5 */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:shadow-lg dark:hover:shadow-slate-950/40 hover:scale-102 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/15">PM2.5</span>
              <span className="text-[10px] text-slate-400 font-mono">Batas: 15</span>
            </div>
            <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">{data.components.pm2_5.toFixed(1)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Debu Mikro Respirasi</p>
          </div>

          {/* Card Component pm10 */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:shadow-lg dark:hover:shadow-slate-950/40 hover:scale-102 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/15">PM10</span>
              <span className="text-[10px] text-slate-400 font-mono">Batas: 45</span>
            </div>
            <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">{data.components.pm10.toFixed(1)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lumpur / Partikel Kasar</p>
          </div>

          {/* Card Component co */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:shadow-lg dark:hover:shadow-slate-950/40 hover:scale-102 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 bg-sky-500/10 text-sky-500 rounded-full border border-sky-500/15">CO (ppm)</span>
              <span className="text-[10px] text-slate-400 font-mono">Batas: 4.0</span>
            </div>
            <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">{data.components.co.toFixed(1)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Karbon Monoksida</p>
          </div>

          {/* Card Component o3 */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:shadow-lg dark:hover:shadow-slate-950/40 hover:scale-102 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/15">O3</span>
              <span className="text-[10px] text-slate-400 font-mono">Batas: 100</span>
            </div>
            <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">{data.components.o3}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lapisan Ozon Permukaan</p>
          </div>

          {/* Card Component no2 */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:shadow-lg dark:hover:shadow-slate-950/40 hover:scale-102 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded-full border border-indigo-500/15">NO2</span>
              <span className="text-[10px] text-slate-400 font-mono">Batas: 25</span>
            </div>
            <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">{data.components.no2}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Nitrogen Dioksida</p>
          </div>

          {/* Card Component so2 */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 hover:border-sky-500/40 dark:hover:border-sky-400/40 hover:shadow-lg dark:hover:shadow-slate-950/40 hover:scale-102 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 bg-teal-500/10 text-teal-500 rounded-full border border-teal-500/15">SO2</span>
              <span className="text-[10px] text-slate-400 font-mono">Batas: 40</span>
            </div>
            <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">{data.components.so2}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sulfur Dioksida</p>
          </div>

        </div>
      </div>

      {/* 3. AI Insights and Charts Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* AI Recommendations Container */}
        <div className="p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 flex flex-col min-h-[420px] shadow-xl relative overflow-hidden">
          {/* Ambient light overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-gradient-to-tr from-sky-400 to-emerald-400 rounded-xl text-slate-950 text-xs font-bold leading-none">
                <Sparkles size={16} />
              </span>
              <div>
                <h2 className="text-base font-display font-semibold text-white">Rekomendasi Kesehatan AI</h2>
                <span className="text-[10px] text-slate-400 font-mono">DIPERKUAT GEMINI • INDONESIAN ENGINE</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
              <Clock size={12} className="text-emerald-400" />
              Realtime Advice
            </div>
          </div>

          {isAiLoading ? (
            <div className="flex-1 flex flex-col justify-center space-y-4 py-8 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-5/6" />
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-8 bg-slate-800 rounded-xl w-full mt-6" />
            </div>
          ) : recommendation ? (
            <div className="flex-1 space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60 hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-300 font-medium">
                    <Heart size={14} className="text-rose-400 shrink-0" />
                    <span>Olahraga Luar Ruangan</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{recommendation.sportsSafety}</p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60 hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-300 font-medium">
                    <UserCheck size={14} className="text-sky-400 shrink-0" />
                    <span>Anjuran Masker</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{recommendation.maskRequired}</p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60 hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-300 font-medium">
                    <Baby size={14} className="text-emerald-400 shrink-0" />
                    <span>Aman bagi Anak-Anak</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{recommendation.childSafety}</p>
                </div>

                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60 hover:bg-slate-800/60 transition-colors">
                  <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-300 font-medium">
                    <Users size={14} className="text-indigo-400 shrink-0" />
                    <span>Aman bagi Lansia</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">{recommendation.elderlySafety}</p>
                </div>
              </div>

              {/* General Advise */}
              <div className="p-4 bg-sky-500/5 rounded-2xl border border-sky-400/10">
                <span className="text-[10px] text-sky-400 font-mono tracking-widest font-semibold uppercase flex items-center gap-1.5 mb-1">
                  <ShieldAlert size={12} /> Mitigasi Lapangan
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{recommendation.generalAdvise}</p>
              </div>

              {/* Best hours */}
              <div className="flex justify-between items-center px-4 py-3 bg-emerald-500/5 rounded-xl border border-emerald-450/10">
                <span className="text-xs text-slate-400">Rentang Aktivitas Terbaik:</span>
                <span className="text-xs font-semibold text-emerald-400">{recommendation.bestOutdoorHours}</span>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500 italic">
              Pilih kota untuk memuat tinjauan algoritma AI.
            </div>
          )}
        </div>

        {/* Historical graphs container */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-md flex flex-col min-h-[420px]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5 gap-3">
            <div>
              <h2 className="text-base font-display font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar size={18} className="text-sky-500" /> Analisis Tren AQI History
              </h2>
              <span className="text-[10px] text-slate-450 font-mono">VARIASI INTENSITAS POLUTAN TERSEMENTARA</span>
            </div>

            {/* Daily/Weekly/Monthly switcher tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl self-start">
              {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                <button
                  id={`dashboard-trend-btn-${tab}`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all shrink-0 ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-900 text-sky-500 dark:text-sky-400 shadow-sm border border-slate-200/50 dark:border-slate-800/50'
                      : 'text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab === 'daily' ? 'Hari ini' : tab === 'weekly' ? 'Mingguan' : 'Bulanan'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[250px] relative">
            {isHistoryLoading ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 italic">
                Sinkronisasi data riwayat...
              </div>
            ) : historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={historyData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentTheme.gradientHex} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={currentTheme.gradientHex} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                      fontSize: '12px',
                      fontFamily: 'sans-serif'
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="aqi" 
                    stroke={currentTheme.gradientHex} 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorAqi)" 
                    name="Indeks AQI"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                Pilih Kota untuk melihat tren historis.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

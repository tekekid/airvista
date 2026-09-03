import React from 'react';
import { Shield, Sparkles, Cpu, Globe, AlertCircle, Bookmark, Compass, Heart } from 'lucide-react';

export default function AboutPlatform() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500">
      
      {/* 1. Header Hero section */}
      <div className="relative p-8 md:p-12 rounded-3xl bg-slate-950 text-slate-100 overflow-hidden border border-slate-800 shadow-xl">
        {/* Glow ambient design backdrops */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl space-y-4 text-left">
          <span className="text-[10px] text-sky-400 font-mono tracking-widest font-bold uppercase flex items-center gap-1.5">
            <Sparkles size={11} /> CLEAN TECH startup
          </span>
          <h1 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
            Menghirup Masa Depan yang Lebih Bersih dengan <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent font-bold">AirVista</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
            AirVista adalah platform monitoring kualitas udara serta analisis lingkungan realtime bertenaga kecerdasan buatan (AI) kelas dunia. Kami mengintegrasikan komputasi satelit, algoritma sains partikulat EPA, dan model generatif canggih guna menyajikan transparansi kualitas ekosistem bagi masyarakat luas demi keselamatan bersama.
          </p>
        </div>
      </div>

      {/* 2. Structured Bento Grid for goals and vision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Vision card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
          <div className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-500 rounded-xl w-fit mb-4">
            <Globe size={18} />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mb-2">Visi AirVista</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Mewujudkan kota pintar (smart city) berkelanjutan di Indonesia yang didukung pemantauan ekologis mandiri, mempercepat kesadaran kesehatan preventif, serta mereduksi emisi karbon terarah.
            </p>
          </div>
        </div>

        {/* Goals card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl w-fit mb-4">
            <Compass size={18} />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mb-2">Tujuan Platform</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Menghadirkan instrumen monitoring instan, realtime, akurat, dan ramah pengguna sehingga setiap individu mampu mengantisipasi polusi mikro di sekitarnya saat beraktivitas sehari-hari.
            </p>
          </div>
        </div>

        {/* Technologies card */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl w-fit mb-4">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mb-2">Teknologi Modern</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Memadukan framework super-cepat React 19, visualisasi kartografi geospasial Leaflet, data cuaca keyless Open-Meteo, serta model penalaran transformatif dari Google Gemini AI.
            </p>
          </div>
        </div>

      </div>

      {/* 3. Education block: Impacts of Pollutants */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side: Detail of Impact on health (Col-span 8) */}
        <div className="lg:col-span-8 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <AlertCircle size={18} className="text-rose-500 animate-pulse" />
            <span className="text-sm font-display font-bold text-slate-900 dark:text-white">Dampak Nyata Polusi Udara Bagi Respirasi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex gap-3">
              <span className="text-sky-500 font-bold font-mono text-sm leading-none">01.</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Penyumbatan Kardiovaskular</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed leading-normal">
                  Mikro debu PM2.5 yang dihirup masuk langsung ke pembuluh darah melalui paru-paru, memicu fluktuasi darah tinggi hingga risiko stroke vaskular jangka panjang.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex gap-3">
              <span className="text-sky-500 font-bold font-mono text-sm leading-none">02.</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Kemunduran Kognisi Anak</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed leading-normal">
                  Riset global WHO membuktikan bahwa paparan debu bertonase timbal menghambat perkembangan sinaps saraf otak anak-anak pada masa keemasan pertumbuhan balita.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex gap-3">
              <span className="text-sky-500 font-bold font-mono text-sm leading-none">03.</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Asma Akut & ISPA</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed leading-normal">
                  Sulphur Dioksida (SO2) dan Nitrogen Dioksida (NO2) dari asap kendaraan merangsang inflamasi saluran pernapasan memicu asma bronkial berat mendadak.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex gap-3">
              <span className="text-sky-500 font-bold font-mono text-sm leading-none">04.</span>
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Asidifikasi Vegetasi</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed leading-normal">
                  Deposisi asam sulfur di atmosfer memicu hujan korosif merusak jaringan stomata dedaunan di kawasan kota, mereduksi kualitas fotosintesis penyuplai oksigen.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Educational Checklist (Col-span 4) */}
        <div className="lg:col-span-4 p-6 bg-indigo-950 text-indigo-200 rounded-3xl border border-indigo-900 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] text-indigo-400 font-mono tracking-widest font-bold uppercase flex items-center gap-1.5">
              <Bookmark size={12} /> Pentingnya Monitoring Udara
            </span>
            <h3 className="text-base font-display font-semibold text-white">Prinsip Kendali Sanitasi</h3>
            
            <p className="text-xs leading-relaxed text-indigo-350">
              Mengetahui kondisi partikulat di lingkungan sekitar secara instan membantu kita mengambil keputusan taktis untuk:
            </p>

            <ul className="space-y-3 pt-2 text-xs text-indigo-300 font-medium">
              <li className="flex items-start gap-2">
                <Shield size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>Mengenakan filtrasi penutup KN95 sesuai ambang batas harian EPA.</span>
              </li>
              <li className="flex items-start gap-2">
                <Heart size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>Mengatur penjadwalan lari kardio luar ruangan yang aman bagi jantung.</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>Pencucian saringan AC rumah terarah guna kemurnian bernapas di kamar tidur.</span>
              </li>
            </ul>
          </div>

          <p className="text-[10px] text-indigo-500 font-mono mt-6 leading-snug">
            AirVista Platform • Menghitung kebersihan ekologis untuk hidup berkelanjutan.
          </p>
        </div>

      </div>

    </div>
  );
}

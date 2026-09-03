import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Check, ArrowRight } from 'lucide-react';
import { CityInfo } from '../types';
import { INDONESIAN_CITIES } from '../utils/cities';

interface IndonesiaSearchComboboxProps {
  onSelect: (name: string, lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

export default function IndonesiaSearchCombobox({
  onSelect,
  placeholder = "Cari wilayah seluruh Indonesia...",
  className = "",
  initialValue = ""
}: IndonesiaSearchComboboxProps) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial popular/recommended Indonesian stations when input is empty
  const defaultFavorites = [
    { name: 'Jakarta Pusat', fullName: 'Jakarta Pusat (DKI Jakarta)', province: 'DKI Jakarta', latitude: -6.186486, longitude: 106.834091 },
    { name: 'Bandung', fullName: 'Bandung (Jawa Barat)', province: 'Jawa Barat', latitude: -6.917464, longitude: 107.619123 },
    { name: 'Surabaya', fullName: 'Surabaya (Jawa Timur)', province: 'Jawa Timur', latitude: -7.257472, longitude: 112.752088 },
    { name: 'Yogyakarta', fullName: 'Yogyakarta (DI Yogyakarta)', province: 'DI Yogyakarta', latitude: -7.795580, longitude: 110.369490 },
    { name: 'Denpasar', fullName: 'Denpasar (Bali)', province: 'Bali', latitude: -8.670458, longitude: 115.212629 },
    { name: 'Banyuwangi', fullName: 'Banyuwangi (Jawa Timur)', province: 'Jawa Timur', latitude: -8.219233, longitude: 114.369113 },
    { name: 'Batang', fullName: 'Batang (Jawa Tengah)', province: 'Jawa Tengah', latitude: -6.905615, longitude: 109.731712 },
    { name: 'Garut', fullName: 'Garut (Jawa Barat)', province: 'Jawa Barat', latitude: -7.227844, longitude: 107.908699 },
  ];

  // Debounced search trigger
  useEffect(() => {
    if (!query.trim()) {
      setResults(defaultFavorites);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(() => {
      fetch(`/api/locations/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.results) {
            setResults(data.results);
          } else {
            setResults([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed searching Indonesian locations:", err);
          // Offline fallback search on our local dataset
          const localFiltered = INDONESIAN_CITIES.filter(
            c => c.name.toLowerCase().includes(query.toLowerCase()) || 
                 c.province.toLowerCase().includes(query.toLowerCase())
          ).map(c => ({
            name: c.name,
            fullName: `${c.name} (${c.province})`,
            province: c.province,
            latitude: c.latitude,
            longitude: c.longitude
          }));
          setResults(localFiltered);
          setLoading(false);
        });
    }, 350); // Fluid debounce time

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside handling to ensure dropdown behavior remains consistent
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: any) => {
    onSelect(item.name, item.latitude, item.longitude);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleSelect(results[activeIndex]);
        } else if (results.length > 0) {
          handleSelect(results[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={comboboxRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
          <Search size={16} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-100 placeholder-slate-500 transition-all font-medium"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Floating Command Palette Result Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-1">
          
          {/* Section banner */}
          <div className="px-4 py-2 border-b border-slate-900 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
              {query ? `Hasil Pencarian : ${results.length} Wilayah` : 'Rujukan Stasiun Terpopuler'}
            </span>
            {loading && <Loader2 size={12} className="animate-spin text-sky-400" />}
          </div>

          {/* Results List */}
          <div className="p-1.5 space-y-0.5">
            {results.length > 0 ? (
              results.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    id={`combo-option-${item.name.replace(/\s+/g, '-')}`}
                    key={`${item.latitude}-${item.longitude}-${item.name}-${index}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${
                      isActive 
                        ? 'bg-sky-500/10 text-sky-400 font-semibold border-l-4 border-sky-400 pl-3' 
                        : 'text-slate-300 hover:bg-slate-900 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md ${isActive ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-900 text-slate-500'}`}>
                        <MapPin size={13} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs md:text-sm font-medium">{item.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal leading-none">{item.fullName || item.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded-full">
                        {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                      </span>
                      {isActive && <ArrowRight size={12} className="text-sky-400 animate-pulse" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 px-4 text-center">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2 size={24} className="animate-spin text-sky-500" />
                    <span className="text-xs font-mono">Membaca jutaan sensori geospasial...</span>
                  </div>
                ) : (
                  <div className="text-slate-500 space-y-2 py-2">
                    <p className="text-xs font-semibold text-slate-400">Pencarian Tidak Ditemukan</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Gunakan nama kota, kabupaten, or kecamatan bahasa Indonesia yang unik (contoh: <strong className="text-sky-400">Sukasari</strong>, <strong className="text-sky-400">Purwokerto</strong>, <strong className="text-sky-400">Banyuwangi</strong>).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

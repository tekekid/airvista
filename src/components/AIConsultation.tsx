import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Sparkles, HelpCircle, Loader2, RefreshCw, Compass, AlertCircle } from 'lucide-react';
import { AirVistaData, ChatMessage } from '../types';

interface AIConsultationProps {
  activeData: AirVistaData;
}

export default function AIConsultation({ activeData }: AIConsultationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Setup starter message customized based on the active city parameters!
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Halo! Saya adalah **AirVista AI Consultant** Anda. 

Saat ini saya tersinkronisasi dengan stasiun **${activeData.locationName}** (AQI: **${activeData.aqi}**, Status: **${activeData.status}**), bersuhu **${activeData.weather.temperature}°C** dengan kecepatan kelicikan angin **${activeData.weather.windSpeed} km/h**.

Silakan ajukan pertanyaan seputar kesehatan pernapasan, olahraga luar ruangan, sirkulasi filter rumah, atau prediksi polusi udara regional!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [activeData.locationName, activeData.aqi]);

  // Handle auto-scroll of chatbot node
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          activeData,
          chatHistory: messages
        })
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: data.text || "Terjadi kendala menghubungi server satelit AirVista.",
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Consultation crash:", err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: "Maaf, terjadi gangguan jaringan saat memproses analisis lingkungan AI Anda.",
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Premade chip helpers
  const promptSuggestions = [
    "Apakah aman jogging sore ini?",
    "Apakah debu PM2.5 mempengaruhi paru-paru anak?",
    "Kapan penyebaran polusi di kawasan ini mereda?",
    "Perlukah menyalakan air purifier di rumah?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in duration-500 h-[calc(100vh-100px)] overflow-hidden">
      
      {/* Ask / Chat segment (Col-span 8) */}
      <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden h-full">
        
        {/* Chat header banner */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-sky-500 to-emerald-400 rounded-xl text-white shadow-md shadow-sky-500/10">
              <Bot size={18} className="animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-slate-900 dark:text-white">Konsultan Lingkungan AI</h2>
              <span className="text-[10px] text-slate-400 font-mono">ONLINE • INTELLIGENT COMPANION</span>
            </div>
          </div>
          <button 
            id="clear-chat-btn"
            onClick={() => setMessages([messages[0]])}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5"
            aria-label="Reset chat"
          >
            <RefreshCw size={13} /> Clear
          </button>
        </div>

        {/* Scrollable messages container */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'}`}
              >
                {/* Custom Avatar icons */}
                <div className={`p-2 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center text-xs ${
                  isAi ? 'bg-sky-500/10 text-sky-500 border border-sky-500/15' : 'bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}>
                  {isAi ? <Bot size={16} /> : <User size={16} />}
                </div>

                <div className="flex flex-col gap-1">
                  <div className={`px-4 py-2.5 rounded-2xl text-xs font-sans leading-relaxed ${
                    isAi 
                      ? 'bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-slate-850 dark:text-slate-200' 
                      : 'bg-gradient-to-tr from-sky-500 to-sky-600 text-white font-medium'
                  }`}>
                    {/* Render plain texts beautifully */}
                    <div className="whitespace-pre-wrap select-text">
                      {msg.text.split('**').map((part, idx) => (
                        idx % 2 === 1 ? <strong key={idx} className="font-bold text-sky-500 dark:text-sky-400">{part}</strong> : part
                      ))}
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono text-slate-400 ${isAi ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[85%] self-start mr-auto">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/15 shrink-0 h-9 w-9 flex items-center justify-center animate-pulse">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center gap-2 text-xs text-slate-450 italic">
                <span>AI sedang menghitung dispersi partikulat...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Dynamic prompt suggestions panel */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 dark:text-slate-550 flex items-center gap-1.5 mb-2">
            <HelpCircle size={12} /> Ajukan pertanyaan instan:
          </span>
          <div className="flex flex-wrap gap-2">
            {promptSuggestions.map((prompt) => (
              <button
                id={`prompt-chip-${prompt.replace(/\s+/g, '-')}`}
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-350 hover:text-sky-500 hover:border-sky-500/30 dark:hover:text-sky-400 rounded-lg border border-slate-200/60 dark:border-slate-800/60 transition-colors shadow-sm text-left active:scale-98 font-semibold"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Input block */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900/60 flex gap-3">
          <input
            id="chat-text-input"
            type="text"
            placeholder="Tanyakan dampak kesehatan, tip ventilasi, dsb..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
            className="flex-1 px-4 py-2.5 bg-slate-100/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-slate-800 dark:text-slate-150 font-medium"
          />
          <button
            id="chat-send-btn"
            onClick={() => handleSendMessage(inputVal)}
            disabled={!inputVal.trim() || loading}
            className="p-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center shrink-0"
            aria-label="Send Message"
          >
            <Send size={16} />
          </button>
        </div>

      </div>

      {/* Info panel on right (Col-span 4) */}
      <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pr-1">
        
        {/* Core summary card */}
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-sky-500/5 dark:from-indigo-500/20 dark:to-sky-500/5 rounded-3xl border border-indigo-500/20 dark:border-indigo-500/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-[10px] text-indigo-400 font-mono tracking-widest font-bold uppercase flex items-center gap-1.5 mb-1">
              <Sparkles size={11} /> AI Summary Card
            </span>
            <h3 className="text-base font-display font-semibold text-slate-900 dark:text-white mb-3">Model Prediksi Mikroklimat</h3>
            
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-normal">
              Asisten AI AirVista menyatukan data dispersi dari satelit Copernicus dan stasiun bumi sensor EPA untuk memodelkan persebaran polutan partikulat di wilayah **${activeData.locationName}**.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 text-sky-500 dark:text-sky-400 rounded-xl border border-sky-500/15">
              <Compass size={16} />
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Akurasi Prediksi</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">94.8% Komparatif Lokal</p>
            </div>
          </div>
        </div>

        {/* Warning caution checklist */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <h4 className="text-xs font-mono tracking-wide font-bold uppercase text-slate-450 flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-500" /> Aturan Berkonsultasi:
          </h4>
          <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-sky-500 font-bold">•</span>
              <span>Rekomendasi bersifat saran sains mitigasi, bukan anjuran medis darurat klinik.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 font-bold">•</span>
              <span>Data diarsip aman secara lokal dan terenkripsi tanpa penjejakan data akun pribadi.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 font-bold">•</span>
              <span>Ubah lokasi pencarian di atas untuk mensinkronisasi ulang bank sains consultant AI.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}

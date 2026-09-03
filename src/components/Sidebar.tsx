import React from 'react';
import { 
  Wind, 
  Map as MapIcon, 
  BarChart2, 
  Bot, 
  RotateCcw, 
  Info, 
  Menu, 
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Core high-tech navigation routes
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Wind },
    { id: 'map', name: 'Peta Kualitas Udara', icon: MapIcon },
    { id: 'trends', name: 'Analisis Tren', icon: BarChart2 },
    { id: 'ai-consult', name: 'AI Insight & Konsul', icon: Bot },
    { id: 'comparison', name: 'Perbandingan Wilayah', icon: RotateCcw },
    { id: 'about', name: 'Tentang Platform', icon: Info },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Header (Locked Dark Theme) */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-emerald-400 rounded-lg text-white">
            <Wind size={20} className="animate-spin-slow" />
          </div>
          <span className="font-display font-bold text-lg text-slate-100">AirVista</span>
          <span className="text-[9px] font-mono tracking-widest font-bold px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-full border border-sky-400/20">SaaS AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            id="mobile-menu-toggle"
            onClick={toggleSidebar}
            className="p-2.5 text-slate-350 hover:text-slate-100 hover:bg-slate-900 rounded-xl transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Desktop Fixed Sidebar (Locked premium Deep Charcoal Slate) */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-slate-950 border-r border-slate-900 p-6 sticky top-0 flex-shrink-0 z-40">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-emerald-400 rounded-xl text-white shadow-lg shadow-sky-500/15">
            <Wind size={22} />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight text-slate-100">AirVista</h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest font-bold uppercase leading-none mt-1">Clean Air Engine</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs md:text-sm transition-all group relative ${
                  isActive 
                    ? 'bg-slate-900 text-sky-400 shadow-xl border border-slate-800' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-905/30'
                }`}
              >
                <IconComponent 
                  size={16} 
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`} 
                />
                <span>{item.name}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-sky-400 to-emerald-400 rounded-l-md" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info - locked status */}
        <div className="mt-auto pt-6 border-t border-slate-900 flex flex-col gap-3">
          <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-slate-900 text-[10px]">
            <span className="text-slate-500 font-mono">Engine Status</span>
            <span className="text-emerald-400 font-mono font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live
            </span>
          </div>

          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-mono">Terminal Sec: Online</span>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation (Locked dark-mode slideout) */}
      <div 
        id="mobile-drawer-overlay"
        onClick={toggleSidebar}
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      
      <aside 
        id="mobile-drawer"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950 p-6 flex flex-col border-r border-slate-900 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'transform-none' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-sky-500 to-emerald-400 rounded-xl text-white">
              <Wind size={20} />
            </div>
            <span className="font-display font-bold text-lg text-slate-100">AirVista</span>
          </div>
          <button 
            id="mobile-close-drawer"
            className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1.5 mb-6 flex-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`drawer-item-${item.id}`}
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-all ${
                  isActive 
                    ? 'bg-slate-900 text-sky-400 border border-slate-800' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                <IconComponent size={14} className={isActive ? 'text-sky-400' : 'text-slate-500'} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-900 pt-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Sensors Link Active</span>
          </div>
          <p className="text-[9px] text-slate-605 font-mono">v1.3.0 • Premium AI Dashboard</p>
        </div>
      </aside>
    </>
  );
}

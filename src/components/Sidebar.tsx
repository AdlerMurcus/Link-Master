
import React from 'react';
import { AppView, Language } from '../types';
import { LayoutGrid, Shuffle, SlidersHorizontal, PlayCircle, Zap } from 'lucide-react';
import { translations } from '../locales';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, lang }) => {
  const t = translations[lang];
  const menuItems = [
    { id: AppView.DASHBOARD, label: t.dashboard, icon: LayoutGrid },
    { id: AppView.RULES, label: t.rules, icon: Shuffle },
    { id: AppView.SETTINGS, label: t.settings, icon: SlidersHorizontal },
  ];

  return (
    <div className="w-44 bg-slate-50/90 border-r border-slate-200 h-full flex flex-col pt-5 pb-5 backdrop-blur-2xl z-50 select-none shrink-0">
      <div className="px-5 mb-8 flex gap-[6px] shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/10 shadow-sm"></div>
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/10 shadow-sm"></div>
        <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/10 shadow-sm"></div>
      </div>

      <div className="px-5 mb-10 flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
          <Zap className="text-white w-4 h-4" fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-black text-slate-900 leading-none tracking-tight">LinkMaster</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Utility Pro</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300
                ${isActive 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'}
              `}
            >
              <Icon size={14} className={isActive ? 'text-blue-500' : 'text-slate-400'} strokeWidth={2.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 mt-auto pt-4 shrink-0">
        <button
          onClick={() => onChangeView(AppView.SIMULATION)}
          className={`
            w-full flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl text-[11px] font-black transition-all duration-300
            ${currentView === AppView.SIMULATION 
              ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
          `}
        >
          <PlayCircle size={14} strokeWidth={2.5} />
          <span>{t.simulation}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

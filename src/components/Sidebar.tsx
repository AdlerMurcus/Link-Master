
import React from 'react';
import { AppView } from '../types';
import { LayoutGrid, Shuffle, SlidersHorizontal, PlayCircle, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: AppView.DASHBOARD, label: '概览', icon: LayoutGrid },
    { id: AppView.RULES, label: '路由', icon: Shuffle },
    { id: AppView.SETTINGS, label: '设置', icon: SlidersHorizontal },
  ];

  return (
    <div className="w-40 bg-slate-50/95 border-r border-slate-200 h-full flex flex-col pt-4 pb-4 backdrop-blur-3xl z-50 select-none shrink-0">
      {/* macOS Traffic Lights - Absolute Top Standard Position */}
      <div className="px-5 mb-10 flex gap-[6px] shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/10 shadow-sm transition-opacity hover:opacity-80"></div>
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/10 shadow-sm transition-opacity hover:opacity-80"></div>
        <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/10 shadow-sm transition-opacity hover:opacity-80"></div>
      </div>

      {/* Brand Section */}
      <div className="px-5 mb-12 flex items-center gap-2.5 shrink-0">
        <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 active:scale-95">
          <Zap className="text-white w-4 h-4" fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-black text-slate-900 leading-none tracking-tight">LinkMaster</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Utility Pro</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[11px] font-black transition-all duration-200
                ${isActive 
                  ? 'bg-white text-slate-900 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] ring-1 ring-slate-200' 
                  : 'text-slate-400 hover:bg-slate-200/50 hover:text-slate-700'}
              `}
            >
              <Icon size={14} className={isActive ? 'text-blue-500' : 'text-slate-400'} strokeWidth={3} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Action Section */}
      <div className="px-2 mt-auto pt-4 shrink-0">
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
          <span>立即测试</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

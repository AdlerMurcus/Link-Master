
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
    { id: AppView.RULES, label: '规则', icon: Shuffle },
    { id: AppView.SETTINGS, label: '设置', icon: SlidersHorizontal },
  ];

  return (
    <div className="w-48 bg-slate-50/80 border-r border-slate-200/50 h-full flex flex-col pt-8 pb-6 backdrop-blur-xl z-40 select-none">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-95 cursor-pointer">
          <Zap className="text-white w-4 h-4" fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-slate-900 leading-none">LinkMaster</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Utility Pro</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200
                ${isActive 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60' 
                  : 'text-slate-500 hover:bg-slate-200/40 hover:text-slate-700'}
              `}
            >
              <Icon size={16} className={isActive ? 'text-blue-500' : 'text-slate-400'} strokeWidth={2.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 mt-auto">
        <button
          onClick={() => onChangeView(AppView.SIMULATION)}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[12px] font-bold transition-all duration-300
            ${currentView === AppView.SIMULATION 
              ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' 
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
          `}
        >
          <PlayCircle size={16} strokeWidth={2.5} />
          <span>立即测试</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

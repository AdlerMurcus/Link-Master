
import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Cpu, Power, Globe, AppWindow } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [autoStart, setAutoStart] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [enableAi, setEnableAi] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);

  // ProSwitch: Professional Capsule Toggle with Status Text
  const ProSwitch = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`
        relative flex items-center gap-2.5 px-4 py-2 rounded-full text-[9px] font-black tracking-[0.1em] transition-all duration-300 select-none
        ${active 
          ? 'bg-blue-600 text-white shadow-[0_5px_15px_-5px_rgba(37,99,235,0.4)] ring-1 ring-blue-400' 
          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 shadow-inner ring-1 ring-slate-200'}
      `}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></div>
      <span className="uppercase">{active ? '已启用 ACTIVE' : '已关闭 OFF'}</span>
    </button>
  );

  return (
    <div className="px-10 py-10 max-w-4xl mx-auto h-full flex flex-col animate-in fade-in duration-300 overflow-y-auto no-scrollbar">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 italic underline decoration-blue-500 decoration-4 underline-offset-4">系统偏好</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Configuration & Global Preferences</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">引擎就绪</span>
        </div>
      </div>

      <div className="space-y-8 pb-12">
        {/* Core System Engine */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
             <Cpu size={16} className="text-slate-400"/>
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">核心拦截引擎</span>
          </div>

          <div className="space-y-7">
            <div className="flex items-center justify-between group">
              <div className="flex-1">
                <div className="text-[14px] font-black text-slate-800">开机自动激活服务</div>
                <div className="text-[11px] text-slate-400 font-bold mt-1 leading-relaxed">系统登录后，LinkMaster 拦截后台将自动驻留并开始监控</div>
              </div>
              <ProSwitch active={autoStart} onClick={() => setAutoStart(!autoStart)} />
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex-1">
                <div className="text-[14px] font-black text-slate-800">极简状态栏模式</div>
                <div className="text-[11px] text-slate-400 font-bold mt-1 leading-relaxed">彻底隐藏 Dock 图标，仅通过 macOS 菜单栏常驻入口进行交互</div>
              </div>
              <ProSwitch active={stealthMode} onClick={() => setStealthMode(!stealthMode)} />
            </div>

            <div className="flex items-center justify-between group">
              <div className="flex-1">
                <div className="text-[14px] font-black text-slate-800">静默式版本同步</div>
                <div className="text-[11px] text-slate-400 font-bold mt-1 leading-relaxed">自动在空闲时间同步并更新 LinkMaster Pro 至最新 LTS 分支</div>
              </div>
              <ProSwitch active={autoUpdate} onClick={() => setAutoUpdate(!autoUpdate)} />
            </div>
          </div>
        </section>

        {/* AI & Cloud Intelligent Routing */}
        <section className="bg-slate-900 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group border border-white/5">
           {/* Geometric Decor */}
           <div className="absolute -top-16 -right-16 opacity-10 group-hover:opacity-20 transition-all duration-1000 rotate-12 group-hover:rotate-0 pointer-events-none">
              <Sparkles size={280} className="text-blue-500" />
           </div>
          
          <div className="flex items-center gap-2.5 mb-8 relative z-10">
             <Sparkles size={16} className="text-blue-400"/>
             <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">智能增强配置 (Gemini Optimized)</span>
          </div>

          <div className="flex items-center justify-between relative z-10 mb-8">
            <div className="max-w-[72%]">
              <div className="text-base font-black text-white mb-2 italic">Gemini 语义化路由预判</div>
              <div className="text-[11px] text-slate-400 font-bold leading-relaxed tracking-wide">
                利用 Google Gemini 引擎深度分析 URL 内容属性及应用上下文。系统将自动预选并高亮标记最符合逻辑的浏览器目标，极大缩短决策时间。
              </div>
            </div>
            <ProSwitch active={enableAi} onClick={() => setEnableAi(!enableAi)} />
          </div>
          
          {enableAi && (
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 animate-in slide-in-from-top-4 relative z-10 ring-1 ring-white/5">
               <ShieldCheck size={18} className="text-green-400" />
               <span className="text-[11px] font-black text-slate-200 tracking-wider uppercase">智能推荐服务已接入并就绪 (Stable Connection)</span>
            </div>
          )}
        </section>
      </div>

      <div className="mt-auto py-8 text-center shrink-0 border-t border-slate-100/50">
         <span className="text-[9px] text-slate-300 font-mono tracking-[0.5em] uppercase font-black">Build Version 1.2.5.9021 LTS Stable</span>
      </div>
    </div>
  );
};

export default SettingsView;

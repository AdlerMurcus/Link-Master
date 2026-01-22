
import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Sparkles, Power } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [autoStart, setAutoStart] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [enableAi, setEnableAi] = useState(true);

  return (
    <div className="p-12 max-w-3xl mx-auto h-full overflow-y-auto no-scrollbar animate-in fade-in duration-300">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">偏好设置</h2>

      <div className="space-y-6">
        {/* 系统设置 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
            <Power size={14} /> 系统
          </h3>
          
          <div className="flex items-center justify-between py-2 group">
            <div>
              <div className="font-bold text-slate-900 text-sm">开机自启动</div>
              <div className="text-xs text-slate-500 font-medium mt-1">登录 macOS 时自动启动 LinkMaster 引擎</div>
            </div>
            <button onClick={() => setAutoStart(!autoStart)} className="text-blue-600 transition-colors hover:scale-105 active:scale-95">
              {autoStart ? <ToggleRight size={40} fill="currentColor" className="text-blue-500" /> : <ToggleLeft size={40} className="text-slate-300" />}
            </button>
          </div>
           
           <div className="w-full h-px bg-slate-50 my-4" />
           
           <div className="flex items-center justify-between py-2 group">
            <div>
              <div className="font-bold text-slate-900 text-sm">自动检查更新</div>
              <div className="text-xs text-slate-500 font-medium mt-1">保持软件始终为最新版本</div>
            </div>
            <button onClick={() => setAutoUpdate(!autoUpdate)} className="text-blue-600 transition-colors hover:scale-105 active:scale-95">
              {autoUpdate ? <ToggleRight size={40} fill="currentColor" className="text-blue-500" /> : <ToggleLeft size={40} className="text-slate-300" />}
            </button>
          </div>
        </section>

        {/* AI 设置 */}
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={120} className="text-blue-500" />
          </div>
          
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-2">
            <Sparkles size={14} /> 智能增强
          </h3>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-slate-900 text-sm">启用 Gemini 智能推荐</div>
              <div className="text-xs text-slate-500 font-medium mt-1">分析 URL 上下文并推荐最佳浏览器</div>
            </div>
            <button onClick={() => setEnableAi(!enableAi)} className="text-blue-600 transition-colors hover:scale-105 active:scale-95">
              {enableAi ? <ToggleRight size={40} fill="currentColor" className="text-blue-500" /> : <ToggleLeft size={40} className="text-slate-300" />}
            </button>
          </div>

          {enableAi && (
            <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 animate-in slide-in-from-top-2">
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed flex items-start gap-2">
                <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>API Key 已通过环境变量配置，智能引擎运行正常。</span>
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsView;

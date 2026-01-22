
import React from 'react';
import { Activity, Clock, ArrowRight, Bot, Sliders, MousePointer2, Zap, ShieldCheck } from 'lucide-react';
import { BrowserApp, HistoryLog } from '../types';
import { getBrowserIcon, APP_ICONS } from '../constants';

interface DashboardViewProps {
  history: HistoryLog[];
  browsers: BrowserApp[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ history, browsers }) => {
  const getMethodBadge = (method: string) => {
    switch(method) {
      case 'AI': return <span className="flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100"><Bot size={10} /> AI</span>;
      case 'Rule': return <span className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100"><Sliders size={10} /> 规则</span>;
      default: return <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200"><MousePointer2 size={10} /> 手动</span>;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (diff < 1) return '刚刚';
    if (diff < 60) return `${diff}m 前`;
    return `${Math.floor(diff / 60)}h 前`;
  };

  return (
    <div className="px-8 py-8 h-full flex flex-col bg-white overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-start justify-between mb-8 shrink-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">系统状态</h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[12px] font-medium text-slate-400">拦截引擎运行中</span>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">已处理</div>
            <div className="text-2xl font-black text-slate-900">1,204</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI 命中</div>
            <div className="text-2xl font-black text-blue-600">94.2%</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 rounded-2xl border border-slate-200/50 overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-200/50 flex justify-between items-center bg-white/50 backdrop-blur-sm shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} /> 最近路由历史
          </span>
          <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700">清除记录</button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-100">
          {history.map((log) => {
            const targetBrowser = browsers.find(b => b.id === log.routedToBrowserId);
            return (
              <div key={log.id} className="px-5 py-4 flex items-center gap-4 hover:bg-white transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center shadow-sm shrink-0">
                  {log.sourceApp && APP_ICONS[log.sourceApp] ? APP_ICONS[log.sourceApp] : <Zap size={14} className="text-slate-300" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-bold text-slate-800">{log.sourceApp || '外部应用'}</span>
                    <span className="text-[10px] font-medium text-slate-400">{formatTime(log.timestamp)}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate max-w-full">
                    {log.url}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {getMethodBadge(log.method)}
                  <ArrowRight size={12} className="text-slate-300" />
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                    {targetBrowser && getBrowserIcon(targetBrowser.type, 4)}
                    <span className="text-[11px] font-bold text-slate-700">{targetBrowser?.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

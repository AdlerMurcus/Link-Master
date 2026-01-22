
import React from 'react';
import { Clock, ArrowRight, Bot, Sliders, Zap, Activity } from 'lucide-react';
import { BrowserApp, HistoryLog, Language } from '../types';
import { getBrowserIcon, APP_ICONS } from '../constants';
import { translations } from '../locales';

interface DashboardViewProps {
  history: HistoryLog[];
  browsers: BrowserApp[];
  lang: Language;
}

const DashboardView: React.FC<DashboardViewProps> = ({ history, browsers, lang }) => {
  const t = translations[lang];

  const getMethodBadge = (method: string) => {
    switch(method) {
      case 'AI': return <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 uppercase tracking-tighter"><Bot size={11} /> AI</span>;
      case 'Rule': return <span className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 uppercase tracking-tighter"><Sliders size={11} /> {t.rules}</span>;
      default: return <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 uppercase tracking-tighter">{lang === 'zh' ? '手动' : 'Manual'}</span>;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (diff < 1) return t.justNow;
    if (diff < 60) return `${diff}${t.minsAgo}`;
    return `${Math.floor(diff / 60)}${t.hoursAgo}`;
  };

  return (
    <div className="px-10 py-10 h-full flex flex-col bg-white overflow-hidden animate-in fade-in duration-500">
      <div className="flex items-start justify-between mb-10 shrink-0">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {t.sysStatus}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-100"></div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.engineRunning}</span>
          </div>
        </div>

        <div className="flex gap-10">
          <div className="text-right">
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">{t.requestsProcessed}</div>
            <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums flex items-center gap-2">
              <Activity size={20} className="text-slate-200" /> 1,204
            </div>
          </div>
          <div className="text-right border-l border-slate-100 pl-10">
            <div className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">{t.aiHitRate}</div>
            <div className="text-3xl font-black text-blue-600 tracking-tight tabular-nums">94.2%</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 rounded-[32px] border border-slate-200/40 overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-200/50 flex justify-between items-center bg-white/80 backdrop-blur-xl shrink-0">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <Clock size={16} className="text-slate-300" /> {t.recentHistory}
          </span>
          <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">{t.clearRecords}</button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-100/40">
          {history.map((log) => {
            const targetBrowser = browsers.find(b => b.id === log.routedToBrowserId);
            return (
              <div key={log.id} className="px-8 py-5 flex items-center gap-6 hover:bg-white transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/60 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                  {log.sourceApp && APP_ICONS[log.sourceApp] ? APP_ICONS[log.sourceApp] : <Zap size={16} className="text-slate-200" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none">{log.sourceApp || t.external}</span>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{formatTime(log.timestamp)}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate opacity-60">
                    {log.url}
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  {getMethodBadge(log.method)}
                  <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                  <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm ring-1 ring-black/5">
                    {targetBrowser && getBrowserIcon(targetBrowser.type, 4)}
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{targetBrowser?.name}</span>
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

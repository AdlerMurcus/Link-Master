
import React, { useEffect, useState } from 'react';
import { BrowserApp, RoutingRule, RuleType, Language } from '../types';
import { getBrowserIcon, APP_ICONS } from '../constants';
import { X, Sparkles, Check, MousePointer2, ExternalLink, Zap } from 'lucide-react';
import { suggestBrowser } from '../services/geminiService';
import { translations } from '../locales';

interface SelectorPopupProps {
  url: string;
  sourceApp?: string;
  browsers: BrowserApp[];
  rules: RoutingRule[];
  lang: Language;
  onSelect: (browserId: string, remember: boolean) => void;
  onCancel: () => void;
  isStandalone?: boolean;
}

const SelectorPopup: React.FC<SelectorPopupProps> = ({ url, sourceApp, browsers, rules, lang, onSelect, onCancel, isStandalone = false }) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ id: string; reason: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setHighlightedIndex(prev => (prev + 1) % browsers.length);
      } else if (e.key === 'ArrowUp') {
        setHighlightedIndex(prev => (prev - 1 + browsers.length) % browsers.length);
      } else if (e.key === 'Enter') {
        onSelect(browsers[highlightedIndex].id, rememberChoice);
      } else if (e.key === 'Escape') {
        onCancel();
      } else if (!isNaN(Number(e.key)) && Number(e.key) > 0 && Number(e.key) <= browsers.length) {
        onSelect(browsers[Number(e.key) - 1].id, rememberChoice);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [browsers, highlightedIndex, onSelect, onCancel, rememberChoice]);

  useEffect(() => {
    if (!url) return;
    const fetchAiAdvice = async () => {
      setIsAiLoading(true);
      try {
        const aiPreferences = rules
          .filter(r => r.type === RuleType.AI_SMART && r.active)
          .map(r => r.value)
          .join('\n');

        const advice = await suggestBrowser(url, sourceApp || 'External App', browsers, aiPreferences);
        setAiSuggestion({ id: advice.browserId, reason: advice.reasoning });
        const aiIdx = browsers.findIndex(b => b.id === advice.browserId);
        if (aiIdx !== -1) setHighlightedIndex(aiIdx);
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
    fetchAiAdvice();
  }, [url, sourceApp, browsers, rules]);

  return (
    <div className="flex flex-col h-full bg-white select-none relative animate-in zoom-in-95 duration-200">
      <div className="absolute top-5 left-5 flex gap-[6px] z-10">
        <div className="w-[10px] h-[10px] rounded-full bg-[#FF5F57] border border-black/5"></div>
        <div className="w-[10px] h-[10px] rounded-full bg-[#FEBC2E] border border-black/5"></div>
        <div className="w-[10px] h-[10px] rounded-full bg-[#28C840] border border-black/5"></div>
      </div>

      {/* Header Area */}
      <div className="px-6 pt-12 pb-4 bg-white shrink-0">
         <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/60 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {sourceApp && APP_ICONS[sourceApp] ? APP_ICONS[sourceApp] : <ExternalLink size={12}/>}
              <span>{sourceApp || (lang === 'zh' ? '外部链接' : 'EXTERNAL')}</span>
            </div>
            <button onClick={onCancel} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-all">
              <X size={20} />
            </button>
         </div>
         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
           <div className="text-[12px] font-medium text-slate-500 break-all line-clamp-2 font-mono leading-relaxed">
             {url || "..."}
           </div>
         </div>
      </div>

      {/* AI Suggestion */}
      {(isAiLoading || aiSuggestion) && (
        <div className="px-6 py-1 shrink-0">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${isAiLoading ? 'bg-slate-50 border-slate-100 animate-pulse' : 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100'}`}>
            <Zap size={14} className={isAiLoading ? "text-slate-400" : "text-white fill-white"} />
            <div className={`flex-1 text-[11px] font-black ${isAiLoading ? 'text-slate-500' : 'text-white'}`}>
              {isAiLoading ? 'AI Thinking...' : aiSuggestion?.reason}
            </div>
          </div>
        </div>
      )}

      {/* Browser Items */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 no-scrollbar min-h-0">
        {browsers.map((browser, idx) => {
          const isSelected = idx === highlightedIndex;
          const isAiPick = aiSuggestion?.id === browser.id;
          return (
            <button
              key={browser.id}
              onClick={() => onSelect(browser.id, rememberChoice)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`
                flex items-center gap-4 w-full p-2.5 rounded-2xl transition-all duration-200
                ${isSelected 
                  ? 'bg-slate-900 text-white shadow-2xl scale-[1.01] -translate-y-0.5' 
                  : 'hover:bg-slate-50 text-slate-600'}
              `}
            >
              <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
                 {getBrowserIcon(browser.type, 5)}
              </div>
              <div className="flex flex-col items-start flex-1 min-w-0 text-left">
                <span className="text-[13px] font-black tracking-tight truncate">{browser.name}</span>
                <span className={`text-[8px] font-black uppercase tracking-widest ${isSelected ? 'text-white/40' : 'text-slate-400'}`}>
                  {browser.isDefault ? (lang === 'zh' ? '系统默认' : 'DEFAULT') : (lang === 'zh' ? '本地已安装' : 'LOCAL')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isAiPick && !isSelected && (
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                    <Sparkles size={10} /> REC
                  </div>
                )}
                <div className={`text-[10px] font-mono w-6 h-6 flex items-center justify-center rounded-lg border ${isSelected ? 'border-white/20 text-white/50' : 'border-slate-200 text-slate-300'}`}>
                  {idx + 1}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Area */}
      <div className="px-6 py-6 bg-white border-t border-slate-50 shrink-0 flex items-center justify-between mt-auto">
        <button 
          onClick={() => setRememberChoice(!rememberChoice)}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all ${rememberChoice ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-100' : 'border-slate-300 text-transparent group-hover:border-slate-400'}`}>
            <Check size={12} strokeWidth={4} />
          </div>
          <span className={`text-[11px] font-black tracking-tight ${rememberChoice ? 'text-slate-900' : 'text-slate-400'}`}>
            {t.remember}
          </span>
        </button>
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <MousePointer2 size={12} />
          <span>{t.confirm}</span>
        </div>
      </div>
    </div>
  );
};

export default SelectorPopup;

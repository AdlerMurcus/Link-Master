
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
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-xl select-none relative animate-in zoom-in-95 duration-200">
      {/* macOS Native Window Controls - Realistic style */}
      <div className="flex items-center px-4 pt-4 pb-2 shrink-0 h-10">
        <div className="flex gap-2">
          <button onClick={onCancel} className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/10 hover:brightness-90 transition-all"></button>
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-black/10 opacity-50 cursor-default"></div>
          <div className="w-3 h-3 rounded-full bg-[#28C840] border border-black/10 opacity-50 cursor-default"></div>
        </div>
        <div className="flex-1 text-center pr-12">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t.confirm}</span>
        </div>
      </div>

      {/* URL & Source Info - Compact */}
      <div className="px-5 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-100 border border-slate-200 text-slate-500">
            {sourceApp && APP_ICONS[sourceApp] ? APP_ICONS[sourceApp] : <ExternalLink size={12}/>}
          </div>
          <span className="text-[11px] font-bold text-slate-600 truncate flex-1">
            {sourceApp || (lang === 'zh' ? '外部来源' : 'External Source')}
          </span>
        </div>
        
        <div className="px-3 py-2 bg-slate-50/50 rounded-xl border border-slate-100">
          <div className="text-[11px] font-mono text-slate-400 break-all line-clamp-1 leading-none">
            {url || "..."}
          </div>
        </div>
      </div>

      {/* AI Intelligence Banner - Professional & Integrated */}
      {(isAiLoading || aiSuggestion) && (
        <div className="px-5 py-1 shrink-0">
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all ${isAiLoading ? 'bg-slate-50 border-slate-100 animate-pulse' : 'bg-blue-600/95 border-blue-500 shadow-lg shadow-blue-500/10'}`}>
            <Sparkles size={12} className={isAiLoading ? "text-slate-400" : "text-white fill-white/20"} />
            <div className={`flex-1 text-[10px] font-bold ${isAiLoading ? 'text-slate-500' : 'text-white'}`}>
              {isAiLoading ? (lang === 'zh' ? '正在智能分析...' : 'Analyzing link...') : aiSuggestion?.reason}
            </div>
          </div>
        </div>
      )}

      {/* Browsers List - Raycast/Spotlight Style List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 no-scrollbar min-h-0 mt-2">
        {browsers.map((browser, idx) => {
          const isSelected = idx === highlightedIndex;
          const isAiPick = aiSuggestion?.id === browser.id;
          return (
            <button
              key={browser.id}
              onClick={() => onSelect(browser.id, rememberChoice)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`
                group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-100
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-slate-100/80 text-slate-700'}
              `}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-white/20' : 'bg-white border border-slate-200/50 shadow-sm'}`}>
                 {getBrowserIcon(browser.type, 4)}
              </div>
              
              <div className="flex flex-col items-start flex-1 min-w-0">
                <div className="flex items-center gap-1.5 w-full">
                  <span className="text-[12px] font-bold tracking-tight truncate">{browser.name}</span>
                  {browser.isDefault && (
                    <span className={`text-[8px] font-black uppercase px-1 py-0.5 rounded border leading-none ${isSelected ? 'border-white/30 text-white/60' : 'border-slate-200 text-slate-400'}`}>
                      {lang === 'zh' ? '默认' : 'DEF'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAiPick && (
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                    <Zap size={8} fill="currentColor" /> REC
                  </div>
                )}
                <div className={`text-[9px] font-mono w-5 h-5 flex items-center justify-center rounded border transition-colors ${isSelected ? 'border-white/30 text-white/50 bg-white/10' : 'border-slate-200 text-slate-300'}`}>
                  {idx + 1}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer - Professional Action Bar */}
      <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 shrink-0 flex items-center justify-between">
        <button 
          onClick={() => setRememberChoice(!rememberChoice)}
          className="flex items-center gap-2 group transition-opacity hover:opacity-80"
        >
          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${rememberChoice ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
            <Check size={10} strokeWidth={4} />
          </div>
          <span className={`text-[10px] font-bold ${rememberChoice ? 'text-slate-900' : 'text-slate-400'}`}>
            {t.remember}
          </span>
        </button>
        
        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
          <MousePointer2 size={10} />
          <span>Press Enter</span>
        </div>
      </div>
    </div>
  );
};

export default SelectorPopup;

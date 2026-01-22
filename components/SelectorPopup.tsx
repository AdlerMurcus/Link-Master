
import React, { useEffect, useState } from 'react';
import { BrowserApp } from '../types';
import { getBrowserIcon, APP_ICONS } from '../constants';
import { X, Sparkles, Check, MousePointer2, ExternalLink, Zap } from 'lucide-react';
import { suggestBrowser } from '../services/geminiService';

interface SelectorPopupProps {
  url: string;
  sourceApp?: string;
  browsers: BrowserApp[];
  onSelect: (browserId: string, remember: boolean) => void;
  onCancel: () => void;
  isStandalone?: boolean;
}

const SelectorPopup: React.FC<SelectorPopupProps> = ({ url, sourceApp, browsers, onSelect, onCancel, isStandalone = false }) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ id: string; reason: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

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
        const advice = await suggestBrowser(url, sourceApp || 'External App', browsers);
        setAiSuggestion({ id: advice.browserId, reason: advice.reasoning });
        const aiIdx = browsers.findIndex(b => b.id === advice.browserId);
        if (aiIdx !== -1) setHighlightedIndex(aiIdx);
      } catch (e) {
        console.error(e);
      } finally {
        setIsAiLoading(false);
      }
    };
    fetchAiAdvice();
  }, [url, sourceApp, browsers]);

  return (
    <div className={`flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 ${isStandalone ? 'border-4 border-slate-100/30' : ''}`}>
      <div className="px-6 pt-7 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200/50">
            {sourceApp && APP_ICONS[sourceApp] ? APP_ICONS[sourceApp] : <ExternalLink size={12}/>}
            <span>{sourceApp || '外部链接'}</span>
          </div>
          <div className="flex-1" />
          <button onClick={onCancel} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="text-[13px] font-medium text-slate-600 break-all line-clamp-2 font-mono leading-relaxed">
            {url || "准备中..."}
          </div>
        </div>
      </div>

      {(isAiLoading || aiSuggestion) && (
        <div className="px-6 pb-2 shrink-0">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${isAiLoading ? 'bg-slate-50 border-slate-100 animate-pulse' : 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'}`}>
            <Zap size={14} className={isAiLoading ? "text-slate-400" : "text-white fill-white"} />
            <div className={`flex-1 text-[12px] font-bold ${isAiLoading ? 'text-slate-500' : 'text-white'}`}>
              {isAiLoading ? '正在思考最佳浏览器...' : aiSuggestion?.reason}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 no-scrollbar min-h-0">
        {browsers.map((browser, idx) => {
          const isSelected = idx === highlightedIndex;
          const isAiPick = aiSuggestion?.id === browser.id;
          
          return (
            <button
              key={browser.id}
              onClick={() => onSelect(browser.id, rememberChoice)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`
                flex items-center gap-4 w-full p-3.5 rounded-2xl transition-all duration-200 group
                ${isSelected 
                  ? 'bg-slate-900 text-white shadow-xl scale-[1.02] -translate-y-0.5' 
                  : 'hover:bg-slate-50 text-slate-600'}
              `}
            >
              <div className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
                 {getBrowserIcon(browser.type, 6)}
              </div>
              
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="text-sm font-black tracking-tight truncate">{browser.name}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isSelected ? 'text-white/40' : 'text-slate-400'}`}>
                  {browser.isDefault ? '系统默认' : '浏览器'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {isAiPick && !isSelected && (
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 animate-bounce">
                    <Sparkles size={10} /> 推荐
                  </div>
                )}
                <div className={`text-[11px] font-mono w-6 h-6 flex items-center justify-center rounded-lg border ${isSelected ? 'border-white/20 text-white/50' : 'border-slate-200 text-slate-300'}`}>
                  {idx + 1}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-6 py-5 bg-white border-t border-slate-50 shrink-0 flex items-center justify-between mt-auto">
        <button 
          onClick={() => setRememberChoice(!rememberChoice)}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${rememberChoice ? 'bg-blue-600 border-blue-600 text-white scale-110' : 'border-slate-300 text-transparent group-hover:border-slate-400'}`}>
            <Check size={12} strokeWidth={4} />
          </div>
          <span className={`text-[12px] font-bold tracking-tight ${rememberChoice ? 'text-slate-900' : 'text-slate-400'}`}>
            记住对 <span className="font-black underline decoration-slate-200">{sourceApp || '此应用'}</span> 的选择
          </span>
        </button>
        
        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-widest">
          <MousePointer2 size={12} />
          <span>确认选择</span>
        </div>
      </div>
    </div>
  );
};

export default SelectorPopup;

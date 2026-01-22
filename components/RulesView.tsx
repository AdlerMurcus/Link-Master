
import React, { useState } from 'react';
import { BrowserApp, RoutingRule, RuleType, Language } from '../types';
import { Trash2, Plus, AppWindow, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { getBrowserIcon } from '../constants';
import { translations } from '../locales';

interface RulesViewProps {
  rules: RoutingRule[];
  browsers: BrowserApp[];
  lang: Language;
  onAddRule: (rule: RoutingRule) => void;
  onDeleteRule: (id: string) => void;
}

const RulesView: React.FC<RulesViewProps> = ({ rules, browsers, lang, onAddRule, onDeleteRule }) => {
  const t = translations[lang];
  const [newType, setNewType] = useState<RuleType>(RuleType.SOURCE_APP);
  const [newValue, setNewValue] = useState('');
  const [newTargetId, setNewTargetId] = useState(browsers[0]?.id || '');

  const handleAdd = () => {
    if (!newValue) return;
    const newRule: RoutingRule = {
      id: Date.now().toString(),
      type: newType,
      value: newValue,
      targetBrowserId: newTargetId,
      active: true,
      description: 'Custom User Rule'
    };
    onAddRule(newRule);
    setNewValue('');
  };

  const getRuleIcon = (type: RuleType) => {
    switch (type) {
      case RuleType.SOURCE_APP: return <AppWindow size={20} />;
      case RuleType.URL_PATTERN: return <Globe size={20} />;
      case RuleType.AI_SMART: return <Sparkles size={20} />;
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto h-full flex flex-col animate-in fade-in duration-300 overflow-hidden">
      <div className="mb-10 shrink-0">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic underline decoration-blue-500 decoration-4 underline-offset-8">
          {t.routingAutomation}
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">{t.customLogic}</p>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm mb-10 flex flex-col gap-6 shrink-0">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
          <button onClick={() => setNewType(RuleType.SOURCE_APP)} className={`flex-1 py-2.5 text-[11px] font-black rounded-xl transition-all ${newType === RuleType.SOURCE_APP ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>{t.appSource}</button>
          <button onClick={() => setNewType(RuleType.URL_PATTERN)} className={`flex-1 py-2.5 text-[11px] font-black rounded-xl transition-all ${newType === RuleType.URL_PATTERN ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>{t.urlKeyword}</button>
          <button onClick={() => setNewType(RuleType.AI_SMART)} className={`flex-1 py-2.5 text-[11px] font-black rounded-xl transition-all ${newType === RuleType.AI_SMART ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}>{t.aiSmart}</button>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-[2] space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
              {newType === RuleType.SOURCE_APP ? t.appLabel : newType === RuleType.URL_PATTERN ? t.urlLabel : t.aiLabel}
            </label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={newType === RuleType.SOURCE_APP ? t.placeholderApp : newType === RuleType.URL_PATTERN ? t.placeholderUrl : t.placeholderAi}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-inner"
            />
          </div>
          <div className="flex-[1] space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">{t.targetBrowser}</label>
            <select
              value={newTargetId}
              onChange={(e) => setNewTargetId(e.target.value)}
              className="w-full pl-5 pr-8 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black appearance-none focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer"
            >
              {browsers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} disabled={!newValue} className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[11px] hover:bg-slate-800 disabled:opacity-30 transition-all flex items-center gap-2 shadow-lg active:scale-95 shrink-0">
            <Plus size={16} strokeWidth={4} /> {t.addRule}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
        {rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
            <Sparkles size={32} className="text-slate-200 mb-4" />
            <p className="font-black text-slate-400 text-sm tracking-tight">{t.noRules}</p>
          </div>
        ) : (
          rules.map(rule => {
            const targetBrowser = browsers.find(b => b.id === rule.targetBrowserId);
            return (
              <div key={rule.id} className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[28px] hover:border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shadow-inner ${rule.type === RuleType.AI_SMART ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {getRuleIcon(rule.type)}
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 block mb-1">
                      {rule.type === RuleType.SOURCE_APP ? 'APP ROUTE' : rule.type === RuleType.URL_PATTERN ? 'URL PATTERN' : 'AI DIRECTIVE'}
                    </span>
                    <div className="text-[16px] font-black text-slate-800 tracking-tight leading-none">{rule.value}</div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                   <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
                   <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                      {targetBrowser && getBrowserIcon(targetBrowser.type, 4)}
                      <span className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{targetBrowser?.name}</span>
                   </div>
                   <button onClick={() => onDeleteRule(rule.id)} className="p-2.5 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RulesView;

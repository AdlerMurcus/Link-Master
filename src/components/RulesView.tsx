
import React, { useState } from 'react';
import { BrowserApp, RoutingRule, RuleType } from '../types';
import { Trash2, Plus, AppWindow, Globe, ArrowRight, FolderOpen, Search, Check } from 'lucide-react';
import { getBrowserIcon } from '../constants';

interface RulesViewProps {
  rules: RoutingRule[];
  browsers: BrowserApp[];
  onAddRule: (rule: RoutingRule) => void;
  onDeleteRule: (id: string) => void;
}

const RulesView: React.FC<RulesViewProps> = ({ rules, browsers, onAddRule, onDeleteRule }) => {
  const [newType, setNewType] = useState<RuleType>(RuleType.SOURCE_APP);
  const [newValue, setNewValue] = useState('');
  const [newTargetId, setNewTargetId] = useState(browsers[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBrowsing, setIsBrowsing] = useState(false);

  const handleAdd = () => {
    if (!newValue || !newTargetId) return;
    const newRule: RoutingRule = {
      id: Date.now().toString(),
      type: newType,
      value: newValue,
      targetBrowserId: newTargetId,
      active: true,
      description: '用户自定义规则'
    };
    onAddRule(newRule);
    setNewValue('');
  };

  const simulateBrowse = () => {
    setIsBrowsing(true);
    setTimeout(() => {
      setIsBrowsing(false);
    }, 1200);
  };

  const filteredRules = rules.filter(r => 
    r.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-8 py-6 max-w-4xl mx-auto h-full flex flex-col animate-in fade-in duration-300 overflow-hidden">
      <div className="flex items-end justify-between mb-6 shrink-0">
        <div className="space-y-0.5">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">路由自动化</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Custom Workflows</p>
        </div>
        
        <div className="relative w-44 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={12} />
          <input 
            type="text" 
            placeholder="搜索已有规则..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Add Rule Form */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col gap-5 shrink-0">
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">路由触发条件</label>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
              <button
                onClick={() => setNewType(RuleType.SOURCE_APP)}
                className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${newType === RuleType.SOURCE_APP ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                来源应用
              </button>
              <button
                onClick={() => setNewType(RuleType.URL_PATTERN)}
                className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${newType === RuleType.URL_PATTERN ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                URL 匹配
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
              {newType === RuleType.SOURCE_APP ? 'App 进程名称' : 'URL 关键字'}
            </label>
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={newType === RuleType.SOURCE_APP ? "例如: Slack, Discord" : "例如: google.com"}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex-1 space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">打开浏览器</label>
            <div className="flex gap-2.5">
              <select
                value={newTargetId}
                onChange={(e) => setNewTargetId(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold appearance-none focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {browsers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <button 
                onClick={simulateBrowse}
                className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 text-[10px] font-bold active:scale-95 shadow-sm ${isBrowsing ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
              >
                {isBrowsing ? <Check size={12} strokeWidth={3} className="animate-in zoom-in" /> : <FolderOpen size={12} />}
                <span>{isBrowsing ? '扫描中...' : '扫描应用'}</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!newValue}
            className="self-end px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={14} strokeWidth={3} /> 添加规则
          </button>
        </div>
      </div>

      {/* Rules List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar min-h-0">
        {filteredRules.map(rule => {
          const targetBrowser = browsers.find(b => b.id === rule.targetBrowserId);
          return (
            <div key={rule.id} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-400 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${rule.type === RuleType.SOURCE_APP ? 'bg-indigo-50 text-indigo-500' : 'bg-orange-50 text-orange-500'}`}>
                  {rule.type === RuleType.SOURCE_APP ? <AppWindow size={18} /> : <Globe size={18} />}
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-300 block mb-1">
                    {rule.type === RuleType.SOURCE_APP ? 'FROM APP' : 'URL MATCH'}
                  </span>
                  <div className="text-[13px] font-black text-slate-800 tracking-tight leading-none">
                    {rule.value}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <ArrowRight size={14} className="text-slate-200 group-hover:text-blue-400 transition-all group-hover:translate-x-0.5" />
                 <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                    {targetBrowser && getBrowserIcon(targetBrowser.type, 4)}
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{targetBrowser?.name}</span>
                 </div>
                 <button 
                  onClick={() => onDeleteRule(rule.id)}
                  className="p-2 text-slate-300 hover:text-red-500 bg-transparent hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                 >
                   <Trash2 size={16} />
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RulesView;

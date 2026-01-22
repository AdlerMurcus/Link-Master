
import React, { useState } from 'react';
import { BrowserApp, RoutingRule, RuleType } from '../types';
import { Trash2, Plus, AppWindow, Globe, ArrowRight } from 'lucide-react';
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

  return (
    <div className="p-10 max-w-4xl mx-auto h-full flex flex-col animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">路由规则</h2>
        <p className="text-slate-500 font-medium">定义特定应用或链接的打开方式</p>
      </div>

      {/* 添加规则表单 */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">规则类型</label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setNewType(RuleType.SOURCE_APP)}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${newType === RuleType.SOURCE_APP ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              源应用 (App)
            </button>
            <button
              onClick={() => setNewType(RuleType.URL_PATTERN)}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${newType === RuleType.URL_PATTERN ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              链接关键词 (URL)
            </button>
          </div>
        </div>

        <div className="flex-[2] space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            {newType === RuleType.SOURCE_APP ? '应用名称 (如 Slack)' : 'URL 包含 (如 google.com)'}
          </label>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={newType === RuleType.SOURCE_APP ? "输入 App 名称..." : "输入域名关键词..."}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex-[1.5] space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">目标浏览器</label>
          <div className="relative">
            <select
              value={newTargetId}
              onChange={(e) => setNewTargetId(e.target.value)}
              className="w-full pl-4 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold appearance-none focus:outline-none focus:border-blue-500"
            >
              {browsers.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!newValue}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> 添加
        </button>
      </div>

      {/* 规则列表 */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
        {rules.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="font-bold">暂无规则</p>
            <p className="text-sm mt-1">添加第一条规则来自动化你的工作流</p>
          </div>
        ) : (
          rules.map(rule => {
            const targetBrowser = browsers.find(b => b.id === rule.targetBrowserId);
            return (
              <div key={rule.id} className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rule.type === RuleType.SOURCE_APP ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                    {rule.type === RuleType.SOURCE_APP ? <AppWindow size={20} /> : <Globe size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {rule.type === RuleType.SOURCE_APP ? 'FROM APP' : 'URL MATCH'}
                      </span>
                    </div>
                    <div className="text-base font-black text-slate-800">
                      {rule.value}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <ArrowRight size={16} className="text-slate-300" />
                   <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
                      {targetBrowser && getBrowserIcon(targetBrowser.type, 4)}
                      <span className="text-sm font-bold text-slate-700">{targetBrowser?.name || 'Unknown'}</span>
                   </div>
                   <button 
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={18} />
                   </button>
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

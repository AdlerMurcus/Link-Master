
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, BrowserApp, RoutingRule } from './types';
import { MOCK_BROWSERS, MOCK_RULES, MOCK_HISTORY } from './constants';
import Sidebar from './components/Sidebar';
import SelectorPopup from './components/SelectorPopup';
import RulesView from './components/RulesView';
import SettingsView from './components/SettingsView';
import DashboardView from './components/DashboardView';
import { Laptop, ArrowRight, MousePointer2, ExternalLink } from 'lucide-react';

const { ipcRenderer } = typeof window !== 'undefined' && (window as any).require ? (window as any).require('electron') : { ipcRenderer: null };

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [viewMode, setViewMode] = useState<'dashboard' | 'popup'>('dashboard');
  
  const [browsers] = useState<BrowserApp[]>(MOCK_BROWSERS);
  const [rules, setRules] = useState<RoutingRule[]>(MOCK_RULES);
  const [history] = useState(MOCK_HISTORY);
  
  const [activeUrl, setActiveUrl] = useState('');
  const [activeSource, setActiveSource] = useState('');
  const [showPopupOverlay, setShowPopupOverlay] = useState(false);

  const triggerPopup = useCallback((url: string, source: string) => {
    setActiveUrl(url);
    setActiveSource(source);
    setShowPopupOverlay(true);
  }, []);

  const handleSelectBrowser = (browserId: string) => {
    const browser = browsers.find(b => b.id === browserId);
    console.log(`Routing to: ${browser?.name} for ${activeUrl}`);
    setShowPopupOverlay(false);
    if (ipcRenderer) {
       ipcRenderer.send('open-in-browser', { url: activeUrl, browserPath: browser?.path });
    }
  };

  const handleCancel = () => {
    setShowPopupOverlay(false);
    if (viewMode === 'popup' && ipcRenderer) {
      ipcRenderer.send('close-window');
    }
  };

  useEffect(() => {
    if (!ipcRenderer) return;
    ipcRenderer.on('view-mode-change', (_: any, mode: 'dashboard' | 'popup') => setViewMode(mode));
    ipcRenderer.on('deep-link', (_: any, data: any) => triggerPopup(data.url, data.source));
    return () => {
      ipcRenderer.removeAllListeners('view-mode-change');
      ipcRenderer.removeAllListeners('deep-link');
    };
  }, [triggerPopup]);

  if (viewMode === 'popup') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-transparent p-4">
        <SelectorPopup 
          url={activeUrl}
          sourceApp={activeSource}
          browsers={browsers}
          onSelect={handleSelectBrowser}
          onCancel={handleCancel}
          isStandalone={true} 
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-100">
      {/* Simulation Window Frame */}
      <div className="w-[840px] h-[600px] bg-white rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-200 flex overflow-hidden relative">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />
        
        <main className="flex-1 bg-white relative overflow-hidden">
          {currentView === AppView.DASHBOARD && <DashboardView history={history} browsers={browsers} />}
          {currentView === AppView.RULES && (
             <RulesView 
               rules={rules} 
               browsers={browsers} 
               onAddRule={r => setRules([...rules, r])} 
               onDeleteRule={id => setRules(rules.filter(x => x.id !== id))} 
             />
          )}
          {currentView === AppView.SETTINGS && <SettingsView />}
          
          {currentView === AppView.SIMULATION && (
            <div className="h-full flex flex-col items-center justify-center p-16 text-center animate-in slide-in-from-right-4 duration-500">
               <div className="w-20 h-20 bg-blue-600 text-white rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-blue-200 ring-8 ring-blue-50">
                 <Laptop size={36} />
               </div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">拦截功能演示</h2>
               <p className="text-[14px] text-slate-400 font-medium mb-12 max-w-sm leading-relaxed">
                 在真实的 macOS 环境中，LinkMaster 会捕获系统级浏览请求。在这里，你可以点击下方卡片模拟这一过程。
               </p>

               <div className="w-full max-w-md grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => triggerPopup('https://github.com/trending', 'Slack')}
                   className="group flex flex-col items-start p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
                 >
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     <ExternalLink size={18} />
                   </div>
                   <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">模拟来源: Slack</div>
                   <div className="text-sm font-bold text-slate-800">查看 GitHub 项目</div>
                 </button>

                 <button 
                   onClick={() => triggerPopup('https://www.figma.com/design/...', 'Postman')}
                   className="group flex flex-col items-start p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
                 >
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     <ExternalLink size={18} />
                   </div>
                   <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">模拟来源: Postman</div>
                   <div className="text-sm font-bold text-slate-800">打开设计文档</div>
                 </button>
               </div>
            </div>
          )}

          {/* Selector Popup Overlay - Visual Demo */}
          {showPopupOverlay && (
            <div className="absolute inset-0 z-50 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-16 animate-in fade-in duration-300">
               <div className="w-[420px] h-[520px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                  <SelectorPopup 
                    url={activeUrl}
                    sourceApp={activeSource}
                    browsers={browsers}
                    onSelect={handleSelectBrowser}
                    onCancel={handleCancel}
                    isStandalone={true}
                  />
               </div>
               <div className="absolute inset-0 -z-10" onClick={handleCancel}></div>
            </div>
          )}
        </main>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
         <MousePointer2 size={14} />
         <span>macOS Desktop Simulator</span>
      </div>
    </div>
  );
};

export default App;

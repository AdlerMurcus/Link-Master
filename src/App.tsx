
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, BrowserApp, RoutingRule } from './types';
import { MOCK_BROWSERS, MOCK_RULES, MOCK_HISTORY } from './constants';
import Sidebar from './components/Sidebar';
import SelectorPopup from './components/SelectorPopup';
import RulesView from './components/RulesView';
import SettingsView from './components/SettingsView';
import DashboardView from './components/DashboardView';
import { Laptop, ArrowRight, MousePointer2 } from 'lucide-react';

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
    console.log(`Routing to: ${browser?.name}`);
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

  // Standalone Popup Mode (used in production when triggered by macOS)
  if (viewMode === 'popup') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-transparent select-none">
        <div className="w-[440px] h-[580px] bg-white shadow-[0_50px_150px_-30px_rgba(0,0,0,0.8)] rounded-[32px] overflow-hidden border border-white/10 ring-1 ring-black/5 animate-in zoom-in-95 duration-300">
          <SelectorPopup 
            url={activeUrl}
            sourceApp={activeSource}
            browsers={browsers}
            onSelect={handleSelectBrowser}
            onCancel={handleCancel}
            isStandalone={true} 
          />
        </div>
      </div>
    );
  }

  // Dashboard / Management Mode
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-200/50 p-4 overflow-hidden select-none font-sans antialiased">
      {/* Simulation Window Frame - Fixed size 820x600 */}
      <div className="w-[820px] h-[600px] bg-white rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-200 flex overflow-hidden relative">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} />
        
        <main className="flex-1 bg-white relative flex flex-col overflow-hidden">
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
            <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-in slide-in-from-right-4 duration-500">
               <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-100 ring-4 ring-blue-50">
                 <Laptop size={32} />
               </div>
               <h2 className="text-xl font-black text-slate-900 tracking-tight mb-3 italic">Intercept Simulation</h2>
               <p className="text-[11px] text-slate-400 font-bold mb-10 max-w-[280px] leading-relaxed uppercase tracking-wider">
                 Simulate system-level link requests. Click a card below to trigger the pure popup.
               </p>

               <div className="w-full max-w-[320px] space-y-3">
                 <button 
                   onClick={() => triggerPopup('https://github.com/trending', 'Slack')}
                   className="w-full group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
                 >
                   <div className="text-left">
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Source: Slack</div>
                     <div className="text-[11px] font-black text-slate-800">Review Pull Request</div>
                   </div>
                   <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                     <ArrowRight size={14} />
                   </div>
                 </button>

                 <button 
                   onClick={() => triggerPopup('https://figma.com/design/...', 'WeChat')}
                   className="w-full group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
                 >
                   <div className="text-left">
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Source: WeChat</div>
                     <div className="text-[11px] font-black text-slate-800">Open Design Docs</div>
                   </div>
                   <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                     <ArrowRight size={14} />
                   </div>
                 </button>
               </div>
            </div>
          )}

          {/* Pure Popup Overlay - Fixed 440x580, no extra padding/containers */}
          {showPopupOverlay && (
            <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-[8px] flex items-center justify-center animate-in fade-in duration-300">
               <div className="w-[440px] h-[580px] shadow-[0_60px_150px_-30px_rgba(0,0,0,0.8)] rounded-[32px] overflow-hidden border border-white/10 ring-1 ring-black/10 animate-in zoom-in-95 duration-200 bg-white">
                  <SelectorPopup 
                    url={activeUrl}
                    sourceApp={activeSource}
                    browsers={browsers}
                    onSelect={handleSelectBrowser}
                    onCancel={handleCancel}
                    isStandalone={true}
                  />
               </div>
               {/* Click background to close */}
               <div className="absolute inset-0 -z-10 cursor-default" onClick={handleCancel}></div>
            </div>
          )}
        </main>
      </div>
      
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
         <MousePointer2 size={12} />
         <span>macOS Simulator Environment</span>
      </div>
    </div>
  );
};

export default App;

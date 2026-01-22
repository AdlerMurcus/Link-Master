
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, BrowserApp, RoutingRule, Language } from './types';
import { MOCK_BROWSERS, MOCK_RULES, MOCK_HISTORY } from './constants';
import Sidebar from './components/Sidebar';
import SelectorPopup from './components/SelectorPopup';
import RulesView from './components/RulesView';
import SettingsView from './components/SettingsView';
import DashboardView from './components/DashboardView';
import { Laptop, ArrowRight, MousePointer2 } from 'lucide-react';
import { translations } from './locales';

const { ipcRenderer } = typeof window !== 'undefined' && (window as any).require ? (window as any).require('electron') : { ipcRenderer: null };

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [viewMode, setViewMode] = useState<'dashboard' | 'popup'>('dashboard');
  const [lang, setLang] = useState<Language>('zh');
  
  const [browsers] = useState<BrowserApp[]>(MOCK_BROWSERS);
  const [rules, setRules] = useState<RoutingRule[]>(MOCK_RULES);
  const [history] = useState(MOCK_HISTORY);
  
  const [activeUrl, setActiveUrl] = useState('');
  const [activeSource, setActiveSource] = useState('');
  const [showPopupOverlay, setShowPopupOverlay] = useState(false);

  const t = translations[lang];

  const triggerPopup = useCallback((url: string, source: string) => {
    setActiveUrl(url);
    setActiveSource(source);
    setShowPopupOverlay(true);
  }, []);

  const handleSelectBrowser = (browserId: string) => {
    const browser = browsers.find(b => b.id === browserId);
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

  // Popup Window Mode (Standalone)
  if (viewMode === 'popup') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-transparent select-none overflow-hidden p-0">
        <div className="w-[440px] h-[580px] bg-white shadow-[0_50px_150px_-30px_rgba(0,0,0,0.8)] rounded-[32px] overflow-hidden border border-white/10 ring-1 ring-black/10">
          <SelectorPopup 
            url={activeUrl}
            sourceApp={activeSource}
            browsers={browsers}
            rules={rules}
            lang={lang}
            onSelect={handleSelectBrowser}
            onCancel={handleCancel}
            isStandalone={true} 
          />
        </div>
      </div>
    );
  }

  // Dashboard Window Mode
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-slate-200/50 p-6 overflow-hidden select-none font-sans antialiased transition-colors duration-1000">
      <div className="w-[840px] h-[640px] bg-white rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-200/60 flex overflow-hidden relative ring-1 ring-black/5">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} lang={lang} />
        
        <main className="flex-1 bg-white relative flex flex-col overflow-hidden min-w-0">
          {currentView === AppView.DASHBOARD && <DashboardView history={history} browsers={browsers} lang={lang} />}
          {currentView === AppView.RULES && (
             <RulesView 
               lang={lang}
               rules={rules} 
               browsers={browsers} 
               onAddRule={r => setRules([...rules, r])} 
               onDeleteRule={id => setRules(rules.filter(x => x.id !== id))} 
             />
          )}
          {currentView === AppView.SETTINGS && (
            <SettingsView lang={lang} onLanguageChange={setLang} />
          )}
          
          {currentView === AppView.SIMULATION && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-in slide-in-from-right-10 duration-700 overflow-y-auto no-scrollbar">
               <div className="w-20 h-20 bg-blue-600 text-white rounded-[30px] flex items-center justify-center mb-10 shadow-2xl shadow-blue-100 ring-8 ring-blue-50 shrink-0">
                 <Laptop size={40} strokeWidth={2.5} />
               </div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
                 {t.testSim}
               </h2>
               <p className="text-[12px] text-slate-400 font-black mb-12 max-w-[320px] leading-relaxed uppercase tracking-[0.2em]">
                 {t.testDesc}
               </p>

               <div className="w-full max-w-[360px] space-y-4">
                 <button onClick={() => triggerPopup('https://github.com/trending', 'Slack')} className="w-full group flex items-center justify-between p-6 bg-white border border-slate-200/80 rounded-[28px] hover:border-blue-500 hover:shadow-2xl transition-all duration-300 active:scale-[0.98]">
                   <div className="text-left">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Source: Slack</div>
                     <div className="text-[15px] font-black text-slate-800 tracking-tight">Github Trending Review</div>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     <ArrowRight size={20} strokeWidth={3} />
                   </div>
                 </button>
                 <button onClick={() => triggerPopup('https://figma.com/design/...', '微信')} className="w-full group flex items-center justify-between p-6 bg-white border border-slate-200/80 rounded-[28px] hover:border-blue-500 hover:shadow-2xl transition-all duration-300 active:scale-[0.98]">
                   <div className="text-left">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Source: WeChat</div>
                     <div className="text-[15px] font-black text-slate-800 tracking-tight">Product Design Workspace</div>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     <ArrowRight size={20} strokeWidth={3} />
                   </div>
                 </button>
               </div>
            </div>
          )}

          {/* Selector Popup Simulation Overlay */}
          {showPopupOverlay && (
            <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-[12px] flex items-center justify-center animate-in fade-in duration-500">
               <div className="w-[440px] h-[580px] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.8)] rounded-[36px] overflow-hidden animate-in zoom-in-95 duration-300 bg-white border border-white/10 ring-1 ring-black/10 shrink-0">
                  <SelectorPopup 
                    url={activeUrl}
                    sourceApp={activeSource}
                    browsers={browsers}
                    rules={rules}
                    lang={lang}
                    onSelect={handleSelectBrowser}
                    onCancel={handleCancel}
                    isStandalone={true}
                  />
               </div>
               <div className="absolute inset-0 -z-10 cursor-default" onClick={handleCancel}></div>
            </div>
          )}
        </main>
      </div>
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] flex items-center gap-4 transition-opacity">
         <MousePointer2 size={14} className="animate-bounce" />
         <span>macOS Professional Runtime Environment</span>
      </div>
    </div>
  );
};

export default App;

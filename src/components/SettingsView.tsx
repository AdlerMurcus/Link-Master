
import React from 'react';
import { Sparkles, ShieldCheck, Cpu, Globe } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales';

interface SettingsViewProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ lang, onLanguageChange }) => {
  const t = translations[lang];
  const [autoStart, setAutoStart] = React.useState(true);
  const [autoUpdate, setAutoUpdate] = React.useState(true);
  const [enableAi, setEnableAi] = React.useState(true);
  const [stealthMode, setStealthMode] = React.useState(false);

  const ProSwitch = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-5 py-2 rounded-full text-[9px] font-black tracking-[0.2em] transition-all duration-500 select-none
        ${active 
          ? 'bg-blue-600 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] ring-2 ring-blue-400/30 ring-offset-2' 
          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 ring-1 ring-slate-200'}
      `}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></div>
      <span>{active ? t.active : t.off}</span>
    </button>
  );

  return (
    <div className="px-12 py-12 max-w-4xl mx-auto h-full flex flex-col animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <div className="mb-12 flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {t.sysConfig}
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">{t.runtimeParams}</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse ring-4 ring-green-100"></div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.engineReady}</span>
        </div>
      </div>

      <div className="space-y-12 pb-20">
        {/* Language Selection */}
        <section className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
             <Globe size={18} className="text-slate-400"/>
             <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">{t.language}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[16px] font-black text-slate-800 tracking-tight">{t.language}</div>
              <div className="text-[12px] text-slate-400 font-bold leading-relaxed">{t.languageDesc}</div>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-[18px] border border-slate-200/50 w-52 shrink-0">
              <button 
                onClick={() => onLanguageChange('zh')}
                className={`flex-1 py-2 text-[10px] font-black rounded-[12px] transition-all duration-300 ${lang === 'zh' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >中文</button>
              <button 
                onClick={() => onLanguageChange('en')}
                className={`flex-1 py-2 text-[10px] font-black rounded-[12px] transition-all duration-300 ${lang === 'en' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >English</button>
            </div>
          </div>
        </section>

        {/* System Options */}
        <section className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
             <Cpu size={18} className="text-slate-400"/>
             <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">Core Interception Engine</span>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between group">
              <div className="max-w-[70%]">
                <div className="text-[16px] font-black text-slate-800 tracking-tight">{t.autoStart}</div>
                <div className="text-[12px] text-slate-400 font-bold mt-2 leading-relaxed">{t.autoStartDesc}</div>
              </div>
              <ProSwitch active={autoStart} onClick={() => setAutoStart(!autoStart)} />
            </div>

            <div className="flex items-center justify-between group border-t border-slate-50 pt-10">
              <div className="max-w-[70%]">
                <div className="text-[16px] font-black text-slate-800 tracking-tight">{t.stealthMode}</div>
                <div className="text-[12px] text-slate-400 font-bold mt-2 leading-relaxed">{t.stealthModeDesc}</div>
              </div>
              <ProSwitch active={stealthMode} onClick={() => setStealthMode(!stealthMode)} />
            </div>

            <div className="flex items-center justify-between group border-t border-slate-50 pt-10">
              <div className="max-w-[70%]">
                <div className="text-[16px] font-black text-slate-800 tracking-tight">{t.silentUpdate}</div>
                <div className="text-[12px] text-slate-400 font-bold mt-2 leading-relaxed">{t.silentUpdateDesc}</div>
              </div>
              <ProSwitch active={autoUpdate} onClick={() => setAutoUpdate(!autoUpdate)} />
            </div>
          </div>
        </section>

        {/* AI Branding Section */}
        <section className="bg-slate-900 p-12 rounded-[32px] shadow-2xl relative overflow-hidden group border border-white/5">
          <div className="absolute -top-16 -right-16 opacity-10 group-hover:opacity-20 transition-all duration-1000 rotate-12 group-hover:rotate-0 pointer-events-none">
             <Sparkles size={320} className="text-blue-500" />
          </div>
          
          <div className="flex items-center gap-3 mb-10 relative z-10">
             <Sparkles size={18} className="text-blue-400"/>
             <span className="text-[11px] font-black uppercase text-blue-400 tracking-[0.2em]">{t.aiEnhanced}</span>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="max-w-[70%]">
              <div className="text-xl font-black text-white mb-3 tracking-tight">{t.aiPredict}</div>
              <div className="text-[13px] text-slate-400 font-bold leading-relaxed tracking-wide opacity-80">{t.aiPredictDesc}</div>
            </div>
            <ProSwitch active={enableAi} onClick={() => setEnableAi(!enableAi)} />
          </div>
        </section>
      </div>

      <div className="mt-auto py-12 text-center shrink-0 border-t border-slate-100/30">
         <span className="text-[10px] text-slate-300 font-mono tracking-[0.4em] uppercase font-black">{t.buildVersion} ID: 1.2.5 LTS</span>
      </div>
    </div>
  );
};

export default SettingsView;

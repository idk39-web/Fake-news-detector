import React from 'react';
import { ShieldCheck, Search, History, HelpCircle, Key } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenAbout: () => void;
  onOpenApiKey: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenHistory, 
  onOpenAbout, 
  onOpenApiKey, 
  historyCount 
}) => {
  return (
    <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight font-sans">
                Veritas
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                AI Fact-Checker
              </span>
            </div>
            <p className="text-xs text-slate-600 hidden sm:block">
              Fake News & Headline Credibility Forensic Detector
            </p>
          </div>
        </div>

        {/* Live Grounding Indicator & Nav Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Search className="w-3 h-3 text-slate-500" />
            <span>Google Search Grounded</span>
          </div>

          <button
            type="button"
            onClick={onOpenApiKey}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs"
            title="Ver o cambiar la clave API de Gemini"
          >
            <Key className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">API Key</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAbout}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="How it works"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

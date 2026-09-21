import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Info
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { NewsInputForm } from './components/NewsInputForm';
import { DualVerdictBox } from './components/DualVerdictBox';
import { ClaimsBreakdown } from './components/ClaimsBreakdown';
import { GroundingSources } from './components/GroundingSources';
import { RedFlagsAndSignals } from './components/RedFlagsAndSignals';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AboutModal } from './components/AboutModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { VerificationResult } from './types';
import { Key } from 'lucide-react';

const STORAGE_KEY = 'veritas_fake_news_history_v1';

export default function App() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<VerificationResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResult: VerificationResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newResult.id);
      const updated = [newResult, ...filtered].slice(0, 20); // keep last 20
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist history:', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove history:', e);
    }
  };

  const handleVerify = async (
    title: string,
    content: string,
    sourceUrl?: string,
    mode: 'deep' | 'fast' = 'deep'
  ) => {
    setIsLoading(true);
    setError(null);

    // Simulated analytical progression steps for clear user feedback
    setLoadingStep(mode === 'deep' ? 'Querying Google Search Grounding for live corroboration...' : 'Parsing claims and semantic diction...');
    
    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Evaluating title vs. content consistency and clickbait indicators...');
    }, 1800);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Synthesizing credibility confidence score & claim-by-claim report...');
    }, 3600);

    const userApiKey = localStorage.getItem('user_gemini_api_key');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (userApiKey) {
      headers['x-gemini-api-key'] = userApiKey;
    }

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title,
          content,
          sourceUrl,
          mode,
          apiKey: userApiKey || undefined,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server returned error (${response.status})`);
      }

      const data = await response.json();
      if (!data.success || !data.result) {
        throw new Error('Invalid verification response received.');
      }

      setResult(data.result);
      saveToHistory(data.result);

      // Scroll to verdict box smoothly
      setTimeout(() => {
        document.getElementById('verdict-box')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Verification failure:', err);
      setError(err.message || 'An unexpected error occurred while verifying the news.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Intro / Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI Disinformation Forensics & Fact-Checking
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
            Fake News & Credibility Detector
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Enter a news headline and information body below. The AI analyzes both boxes independently, cross-references real-time web consensus with Google Search, and provides credibility scores.
          </p>
        </div>

        {/* Form Container */}
        <NewsInputForm onVerify={handleVerify} isLoading={isLoading} />

        {/* Loading Indicator with Multi-step progress */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-blue-200 p-8 shadow-xs text-center space-y-4 animate-in fade-in duration-300">
            <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <Search className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Cross-Referencing Sources & Analyzing Truthfulness
              </h3>
              <p className="text-xs sm:text-sm text-blue-700 font-medium">
                {loadingStep || 'Verifying authenticity against live web sources...'}
              </p>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Scanning fact-checking repositories, primary journalistic wires, and empirical databases to establish factual consensus.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-900 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div>
                <h4 className="text-sm font-bold text-rose-950">Verification Failed</h4>
                <p className="text-xs sm:text-sm text-rose-800 leading-relaxed mt-0.5">{error}</p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsApiKeyOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Configurar / Cambiar Llave API</span>
                </button>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Verification Report Results */}
        {result && !isLoading && (
          <div className="space-y-6 pt-2">
            {/* Main Dual Box Verdict (Answers the user's primary requirement directly) */}
            <DualVerdictBox result={result} />

            {/* Claims Breakdown */}
            <ClaimsBreakdown claims={result.claims} />

            {/* Disinformation Flags vs Reputable Signals */}
            <RedFlagsAndSignals
              redFlags={result.redFlags}
              reputableSignals={result.reputableSignals}
            />

            {/* Live Search Sources */}
            <GroundingSources
              sources={result.searchGroundingSources}
              searchQueries={result.searchQueriesUsed}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Powered by Gemini & Live Google Search Grounding</span>
          </p>
          <p className="text-[11px] text-slate-400">
            For critical decisions, always consult accredited primary sources and certified journalism.
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => setResult(item)}
        onClearHistory={handleClearHistory}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
      />
    </div>
  );
}

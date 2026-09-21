import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  RotateCcw, 
  Clipboard, 
  Link as LinkIcon, 
  Layers, 
  ArrowRight,
  Info,
  Heading,
  FileText
} from 'lucide-react';
import { SAMPLE_NEWS } from '../data/sampleNews';
import { SampleNews } from '../types';

interface NewsInputFormProps {
  onVerify: (title: string, content: string, sourceUrl?: string, mode?: 'deep' | 'fast') => Promise<void>;
  isLoading: boolean;
}

export const NewsInputForm: React.FC<NewsInputFormProps> = ({ onVerify, isLoading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [showSourceInput, setShowSourceInput] = useState(false);
  const [mode, setMode] = useState<'deep' | 'fast'>('deep');

  const handlePasteTitle = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setTitle(text);
    } catch {
      // ignore
    }
  };

  const handlePasteContent = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setContent(text);
    } catch {
      // ignore
    }
  };

  const handleLoadSample = (sample: SampleNews) => {
    setTitle(sample.title);
    setContent(sample.content);
    setSourceUrl('');
  };

  const handleClearAll = () => {
    setTitle('');
    setContent('');
    setSourceUrl('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!title.trim() && !content.trim()) || isLoading) return;
    onVerify(title, content, sourceUrl, mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6">
      {/* Sample Quick Try Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Quick Test Samples:
          </span>
          {(title || content) && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Fields
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SAMPLE_NEWS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="text-left p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  sample.expectedType === 'fake' 
                    ? 'bg-rose-100 text-rose-700' 
                    : sample.expectedType === 'clickbait'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {sample.expectedType.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-medium">Load →</span>
              </div>
              <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug">
                {sample.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-5">
        {/* Box 1: News Title / Headline Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="news-title-input" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Heading className="w-4 h-4 text-blue-600" />
              1. News Title / Headline Box
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-600">{title.length} characters</span>
              <button
                type="button"
                onClick={handlePasteTitle}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded"
              >
                <Clipboard className="w-3 h-3" />
                Paste Title
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              id="news-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paste or type the news headline (e.g., 'NASA Discovers New Habitable Exoplanet in Trappist System')..."
              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 border border-slate-300 rounded-xl text-base font-serif placeholder:font-sans placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Box 2: News Information / Article Body Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="news-content-input" className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-600" />
              2. News Information / Article Content Box
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-600">{wordCount} words</span>
              <button
                type="button"
                onClick={handlePasteContent}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded"
              >
                <Clipboard className="w-3 h-3" />
                Paste Body
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="news-content-input"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the full article body, claim paragraph, social post, or news excerpt here to examine for real vs fake statements, factual consistency, and deceptive rhetoric..."
              className="w-full px-4 py-3 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 border border-slate-300 rounded-xl text-sm leading-relaxed placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y shadow-2xs"
            />
          </div>
        </div>

        {/* Optional Source URL Toggle */}
        <div className="space-y-2 pt-1">
          {!showSourceInput ? (
            <button
              type="button"
              onClick={() => setShowSourceInput(true)}
              className="text-xs font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
              + Add article link or publisher domain (optional)
            </button>
          ) : (
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label htmlFor="source-url-input" className="text-xs font-semibold text-slate-600">
                  Source URL or Outlet:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowSourceInput(false);
                    setSourceUrl('');
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Hide
                </button>
              </div>
              <input
                id="source-url-input"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://example.com/news-story..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Bottom Actions & Mode Selector */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Investigation Mode:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMode('deep')}
                className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  mode === 'deep'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Search className="w-3 h-3 text-blue-500" />
                Live Search Grounded
              </button>
              <button
                type="button"
                onClick={() => setMode('fast')}
                className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                  mode === 'fast'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Fast Heuristic
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-[11px] text-slate-600">
              Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono">⌘+Enter</kbd>
            </span>
            <button
              id="verify-button"
              type="submit"
              disabled={(!title.trim() && !content.trim()) || isLoading}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all ${
                (!title.trim() && !content.trim()) || isLoading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Cross-Checking News...</span>
                </>
              ) : (
                <>
                  <span>Detect & Verify Credibility</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

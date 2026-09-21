import React from 'react';
import { X, Trash2, Clock, ExternalLink, ArrowRight } from 'lucide-react';
import { VerificationResult } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: VerificationResult[];
  onSelectResult: (result: VerificationResult) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Verification History</h3>
            <span className="text-xs text-slate-600">({history.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-rose-600 hover:text-rose-800 p-1.5 rounded hover:bg-rose-50 transition-colors flex items-center gap-1"
                title="Clear all history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Clock className="w-10 h-10 stroke-1 mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No checks yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Articles you verify during this session will be saved here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const formattedTime = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              let verdictText = 'Likely Real';
              if (item.overallVerdict === 'LIKELY_FAKE') {
                badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
                verdictText = 'Likely Fake';
              } else if (item.overallVerdict === 'MISLEADING_CLICKBAIT') {
                badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                verdictText = 'Clickbait';
              } else if (item.overallVerdict === 'UNVERIFIED_DISPUTED') {
                badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
                verdictText = 'Unverified';
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/60 hover:border-blue-300 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {verdictText} ({item.credibilityScore}%)
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{formattedTime}</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700">
                    {item.inputTitle || item.inputContent.slice(0, 80) + '...'}
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px] text-slate-400 group-hover:text-blue-600 font-medium">
                    <span>Title: {item.titleAnalysis.verdict} • Info: {item.contentAnalysis.verdict}</span>
                    <span className="flex items-center gap-0.5">
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

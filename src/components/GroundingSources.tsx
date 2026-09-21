import React from 'react';
import { ExternalLink, Globe, Search, ShieldCheck } from 'lucide-react';
import { GroundingSource } from '../types';

interface GroundingSourcesProps {
  sources: GroundingSource[];
  searchQueries?: string[];
}

export const GroundingSources: React.FC<GroundingSourcesProps> = ({
  sources,
  searchQueries,
}) => {
  if ((!sources || sources.length === 0) && (!searchQueries || searchQueries.length === 0)) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Live Google Search Grounding Sources
            </h3>
            <p className="text-xs text-slate-600">
              Corroborating web citations and official reporting retrieved by AI
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Web Verified
        </span>
      </div>

      {searchQueries && searchQueries.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <Search className="w-3 h-3 text-slate-600" />
            Live Search Queries Executed:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {searchQueries.map((query, i) => (
              <span
                key={i}
                className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono border border-slate-200/60"
              >
                "{query}"
              </span>
            ))}
          </div>
        </div>
      )}

      {sources && sources.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
            Retrieved Primary Sources ({sources.length}):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sources.map((src, index) => {
              let domain = '';
              try {
                domain = new URL(src.url).hostname.replace('www.', '');
              } catch {
                domain = 'web source';
              }

              return (
                <a
                  key={index}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-2 p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all group"
                >
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 line-clamp-1">
                      {src.title || domain}
                    </p>
                    <p className="text-[11px] text-slate-600 truncate flex items-center gap-1 font-mono">
                      {domain}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-600 shrink-0 mt-0.5" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

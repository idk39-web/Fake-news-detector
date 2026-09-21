import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface RedFlagsAndSignalsProps {
  redFlags: string[];
  reputableSignals: string[];
}

export const RedFlagsAndSignals: React.FC<RedFlagsAndSignalsProps> = ({
  redFlags,
  reputableSignals,
}) => {
  const hasRedFlags = redFlags && redFlags.length > 0;
  const hasSignals = reputableSignals && reputableSignals.length > 0;

  if (!hasRedFlags && !hasSignals) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Red Flags Card */}
      {hasRedFlags && (
        <div className="bg-white rounded-xl border border-rose-100 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertCircle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Disinformation Flags ({redFlags.length})
            </h4>
          </div>
          <ul className="space-y-2">
            {redFlags.map((flag, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reputable Signals Card */}
      {hasSignals && (
        <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Credibility Signals ({reputableSignals.length})
            </h4>
          </div>
          <ul className="space-y-2">
            {reputableSignals.map((signal, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

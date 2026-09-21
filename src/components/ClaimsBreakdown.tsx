import React from 'react';
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { ClaimVerification } from '../types';

interface ClaimsBreakdownProps {
  claims: ClaimVerification[];
}

export const ClaimsBreakdown: React.FC<ClaimsBreakdownProps> = ({ claims }) => {
  if (!claims || claims.length === 0) {
    return null;
  }

  const getVerdictBadge = (verdict: ClaimVerification['verdict']) => {
    switch (verdict) {
      case 'VERIFIED_TRUE':
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />,
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Verified True',
        };
      case 'FALSE_DEBUNKED':
        return {
          icon: <XCircle className="w-4 h-4 text-rose-600 shrink-0" />,
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'False / Debunked',
        };
      case 'MISLEADING':
        return {
          icon: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Misleading / Out of Context',
        };
      case 'UNVERIFIED':
      default:
        return {
          icon: <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />,
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          label: 'Unverified Claim',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Factual Claims Breakdown ({claims.length})
          </h3>
          <p className="text-xs text-slate-600">
            Isolated factual assertions and empirical cross-examinations
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {claims.map((claimItem, index) => {
          const config = getVerdictBadge(claimItem.verdict);
          return (
            <div
              key={index}
              className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-2 max-w-2xl">
                  {config.icon}
                  <span className="text-sm font-medium text-slate-900 leading-snug">
                    "{claimItem.claim}"
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.badge}`}>
                  {config.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                {claimItem.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

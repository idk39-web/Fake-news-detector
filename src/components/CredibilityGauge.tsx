import React from 'react';

interface CredibilityGaugeProps {
  score: number;
  confidenceScore: number;
  size?: number;
}

export const CredibilityGauge: React.FC<CredibilityGaugeProps> = ({
  score,
  confidenceScore,
  size = 140,
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-emerald-600';
  let bgStroke = 'stroke-emerald-100';
  let badgeLabel = 'Highly Credible';
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';

  if (score < 35) {
    colorClass = 'text-rose-600';
    bgStroke = 'stroke-rose-100';
    badgeLabel = 'Likely Fake / Hoax';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (score < 65) {
    colorClass = 'text-amber-600';
    bgStroke = 'stroke-amber-100';
    badgeLabel = 'Disputed / Questionable';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (score < 80) {
    colorClass = 'text-blue-600';
    bgStroke = 'stroke-blue-100';
    badgeLabel = 'Generally Credible';
    badgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className={bgStroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tracking-tight text-slate-900">
            {score}
            <span className="text-lg font-normal text-slate-500">%</span>
          </span>
          <span className="text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
            Credibility
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1">
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeBg}`}>
          {badgeLabel}
        </span>
        <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
          AI Confidence: <strong className="text-slate-800">{confidenceScore}%</strong>
        </span>
      </div>
    </div>
  );
};

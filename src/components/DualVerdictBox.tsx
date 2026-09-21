import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  Flame,
  Scale,
  FileText,
  Heading
} from 'lucide-react';
import { VerificationResult, SpecificVerdict, OverallVerdict } from '../types';
import { CredibilityGauge } from './CredibilityGauge';

interface DualVerdictBoxProps {
  result: VerificationResult;
}

export const DualVerdictBox: React.FC<DualVerdictBoxProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const getOverallStyle = (verdict: OverallVerdict) => {
    switch (verdict) {
      case 'LIKELY_REAL':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          title: 'Verified Authentic / Likely Real',
          desc: 'High factual credibility. Key claims are consistent with established facts and verifiable reporting.',
          containerBg: 'bg-emerald-50/50 border-emerald-200',
          badgeBg: 'bg-emerald-600 text-white',
          textColor: 'text-emerald-900',
        };
      case 'LIKELY_FAKE':
        return {
          icon: <XCircle className="w-6 h-6 text-rose-600" />,
          title: 'Likely Fake / Disinformation Alert',
          desc: 'Severe falsehoods detected. Claims are fabricated, scientifically impossible, or contradict factual consensus.',
          containerBg: 'bg-rose-50/50 border-rose-200',
          badgeBg: 'bg-rose-600 text-white',
          textColor: 'text-rose-900',
        };
      case 'MISLEADING_CLICKBAIT':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          title: 'Misleading / Clickbait Detected',
          desc: 'Sensationalized headline or distorted context. The title exaggerates or contradicts the actual information.',
          containerBg: 'bg-amber-50/50 border-amber-200',
          badgeBg: 'bg-amber-600 text-white',
          textColor: 'text-amber-900',
        };
      case 'UNVERIFIED_DISPUTED':
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-slate-600" />,
          title: 'Unverified / Disputed Claims',
          desc: 'Insufficient reliable primary sources or conflicting accounts exist. Caution is advised.',
          containerBg: 'bg-slate-100 border-slate-300',
          badgeBg: 'bg-slate-700 text-white',
          textColor: 'text-slate-900',
        };
    }
  };

  const getSpecificVerdictBadge = (verdict: SpecificVerdict, isTitle: boolean) => {
    switch (verdict) {
      case 'REAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {isTitle ? 'Title is Real' : 'Information is Real'}
          </span>
        );
      case 'FAKE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            {isTitle ? 'Title is Fake / Fabricated' : 'Information is Fake / False'}
          </span>
        );
      case 'MISLEADING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            {isTitle ? 'Title is Clickbait / Exaggerated' : 'Information is Distorted'}
          </span>
        );
      case 'UNVERIFIED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-200 text-slate-800 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            {isTitle ? 'Title Unverified' : 'Information Unverified'}
          </span>
        );
    }
  };

  const overallStyle = getOverallStyle(result.overallVerdict);

  const handleCopyReport = () => {
    const report = `[VERITAS FAKE NEWS DETECTOR REPORT]
Overall Verdict: ${result.overallVerdict}
Credibility Score: ${result.credibilityScore}%
AI Confidence: ${result.confidenceScore}%

Title: "${result.inputTitle}"
Title Status: ${result.titleAnalysis.verdict} (Score: ${result.titleAnalysis.score}%)
Clickbait Level: ${result.titleAnalysis.clickbaitLevel}
Title Analysis: ${result.titleAnalysis.analysis}

Information Status: ${result.contentAnalysis.verdict} (Score: ${result.contentAnalysis.score}%)
Accuracy Level: ${result.contentAnalysis.factualAccuracy} | Emotional Tone: ${result.contentAnalysis.emotionalTone}
Content Analysis: ${result.contentAnalysis.analysis}

Summary: ${result.summary}`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="verdict-box" className="space-y-6">
      {/* Primary Verdict Banner */}
      <div className={`rounded-2xl border p-6 shadow-sm transition-all ${overallStyle.containerBg}`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md shadow-xs ${overallStyle.badgeBg}`}>
                VERDICT
              </span>
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Fact-Checked with Gemini & Google Search Grounding
              </span>
            </div>

            <div className="flex items-center gap-3">
              {overallStyle.icon}
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${overallStyle.textColor}`}>
                {overallStyle.title}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-3xl">
              {result.summary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs"
                title="Copy verification report"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Report Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Verification Summary</span>
                  </>
                )}
              </button>

              {result.searchGroundingSources.length > 0 && (
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  {result.searchGroundingSources.length} Live Web Sources Cross-Referenced
                </span>
              )}
            </div>
          </div>

          <div className="self-center lg:self-auto shrink-0">
            <CredibilityGauge 
              score={result.credibilityScore} 
              confidenceScore={result.confidenceScore} 
            />
          </div>
        </div>
      </div>

      {/* Discrepancy Alert between Title & Body (if headline doesn't match content) */}
      {!result.titleAnalysis.matchesContent && result.titleAnalysis.discrepancyNotes && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-950">
              Title vs. Information Discrepancy Detected
            </h4>
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              {result.titleAnalysis.discrepancyNotes}
            </p>
          </div>
        </div>
      )}

      {/* Dual Analysis Cards: Title Box vs Information Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Box 1: Title Box Analysis */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                  <Heading className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Title Evaluation</h3>
                  <span className="text-[11px] text-slate-600">Headline authenticity & sensationalism</span>
                </div>
              </div>
              {getSpecificVerdictBadge(result.titleAnalysis.verdict, true)}
            </div>

            {/* Title Quote */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Evaluated Headline:
              </p>
              <p className="text-sm font-serif italic text-slate-800 line-clamp-3">
                "{result.inputTitle || '(No headline provided)'}"
              </p>
            </div>

            {/* Score & Clickbait Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-600 block">Title Credibility</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-bold text-slate-900">{result.titleAnalysis.score}%</span>
                  <span className="text-xs text-slate-600 font-medium">accuracy</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      result.titleAnalysis.score >= 70 
                        ? 'bg-emerald-500' 
                        : result.titleAnalysis.score >= 40 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${result.titleAnalysis.score}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  Clickbait Level
                </span>
                <span className={`text-xs font-bold inline-block mt-1 px-2 py-0.5 rounded ${
                  result.titleAnalysis.clickbaitLevel === 'NONE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : result.titleAnalysis.clickbaitLevel === 'LOW'
                    ? 'bg-blue-100 text-blue-800'
                    : result.titleAnalysis.clickbaitLevel === 'MODERATE'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {result.titleAnalysis.clickbaitLevel}
                </span>
              </div>
            </div>

            {/* In-depth Analysis */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">Detailed Headline Findings:</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {result.titleAnalysis.analysis}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Matches Article Body:</span>
            <span className={`font-semibold ${result.titleAnalysis.matchesContent ? 'text-emerald-700' : 'text-rose-600'}`}>
              {result.titleAnalysis.matchesContent ? 'Yes, aligns with text' : 'No, misleading divergence'}
            </span>
          </div>
        </div>

        {/* Box 2: Information / Content Box Analysis */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Information Body Evaluation</h3>
                  <span className="text-[11px] text-slate-600">Factual integrity & empirical backing</span>
                </div>
              </div>
              {getSpecificVerdictBadge(result.contentAnalysis.verdict, false)}
            </div>

            {/* Content Preview */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Analyzed Information Text:
              </p>
              <p className="text-xs sm:text-sm text-slate-700 line-clamp-3">
                {result.inputContent || '(No information body provided)'}
              </p>
            </div>

            {/* Score & Accuracy Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-600 block">Content Credibility</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-bold text-slate-900">{result.contentAnalysis.score}%</span>
                  <span className="text-xs text-slate-600 font-medium">factual score</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      result.contentAnalysis.score >= 70 
                        ? 'bg-emerald-500' 
                        : result.contentAnalysis.score >= 40 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${result.contentAnalysis.score}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-indigo-500" />
                  Emotional Tone
                </span>
                <span className={`text-xs font-bold inline-block mt-1 px-2 py-0.5 rounded ${
                  result.contentAnalysis.emotionalTone === 'OBJECTIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : result.contentAnalysis.emotionalTone === 'BIASED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {result.contentAnalysis.emotionalTone}
                </span>
              </div>
            </div>

            {/* In-depth Analysis */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">Detailed Content Findings:</span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {result.contentAnalysis.analysis}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Factual Accuracy Grade:</span>
            <span className="font-semibold text-slate-800">
              {result.contentAnalysis.factualAccuracy} ACCURACY
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

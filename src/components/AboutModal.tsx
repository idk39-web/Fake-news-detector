import React from 'react';
import { X, ShieldCheck, Search, Scale, Heading, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-200 z-10 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">How Veritas Detects Fake News</h3>
              <p className="text-xs text-slate-600">Forensic AI architecture & verification principles</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Search className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold mb-0.5">
                1. Live Google Search Grounding
              </strong>
              The AI actively queries the live web to check if the claims have been corroborated by verified press agencies (AP, Reuters, BBC), official government databases, scientific journals, or debunked by fact-checking organizations.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Heading className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold mb-0.5">
                2. Dual Title vs. Information Alignment
              </strong>
              One of the most widespread disinformation tactics is pairing a real, mundane study with a wildly sensational, exaggerated headline. Veritas evaluates both boxes independently and tests whether the headline accurately reflects the body.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Scale className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold mb-0.5">
                3. Forensic Linguistic Heuristics
              </strong>
              Detects emotional manipulation, urgency triggers, clickbait framing, anonymous unverified attribution ("sources say", "experts reveal"), and logical fallacies.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold mb-0.5">
                4. Confidence & Credibility Scoring
              </strong>
              Produces a calibrated 0–100% credibility rating indicating the empirical likelihood of authenticity, paired with an AI confidence index based on source consensus.
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got it, take me back
          </button>
        </div>
      </div>
    </div>
  );
};

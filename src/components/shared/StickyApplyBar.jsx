import { useState } from 'react';
import { BASE_RATE } from '../../utils/constants.js';

export default function StickyApplyBar({ score, activeTab, onApply }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (!score || !score.rateReduction || score.rateReduction <= 0) return null;
  if (activeTab === 'rate') return null;

  const greenRate = (BASE_RATE - score.rateReduction).toFixed(2);
  const loanAmount = 250000;
  const termYears = 5;
  const calcMonthly = (rate) => {
    const mr = rate / 100 / 12;
    const n = termYears * 12;
    if (mr === 0) return loanAmount / n;
    return (loanAmount * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1);
  };
  const annualSaving = Math.round(
    (calcMonthly(BASE_RATE) - calcMonthly(BASE_RATE - score.rateReduction)) * 12
  );

  return (
    <div className="sticky-bar-enter fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-green-deep to-[#0f8a5f] text-white shadow-[0_-4px_24px_rgba(0,0,0,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              Pre-qualified at {greenRate}% — Save AED {annualSaving.toLocaleString()}/yr
            </p>
            <p className="text-xs text-white/70 truncate hidden sm:block">
              {score.tier} tier &middot; Based on your GreenDrive Score of {score.totalScore}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onApply}
              className="px-4 py-2 bg-white text-green-deep rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Apply Now
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4 text-white/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

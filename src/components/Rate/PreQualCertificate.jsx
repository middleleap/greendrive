import { useState } from 'react';
import Card from '../shared/Card.jsx';
import { BASE_RATE } from '../../utils/constants.js';

export default function PreQualCertificate({ score, vehicle }) {
  const [shared, setShared] = useState(false);

  if (!score || !score.rateReduction) return null;

  const greenRate = BASE_RATE - score.rateReduction;
  const today = new Date();
  const validUntil = new Date(today.getTime() + 30 * 86400000);

  const formatDate = (d) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleShare = async () => {
    const text = `I'm pre-qualified for a Bank Green Car Loan at ${greenRate.toFixed(2)}% (${score.tier} tier) with a GreenDrive Score of ${score.totalScore}/100. #GreenDrive #GreenFinance`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'GreenDrive Pre-Qualification', text });
        setShared(true);
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard?.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <Card>
      <h3 className="section-title mb-4">Pre-Qualification Certificate</h3>

      {/* Certificate Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-green-deep/20 bg-gradient-to-br from-green-pastel to-white p-6">
        {/* Watermark */}
        <div className="absolute right-[-30px] top-[-30px] w-40 h-40 opacity-[0.04]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-green-deep">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <img src="/assets/logos/default.svg" alt="Bank" className="h-5" />
            <span className="text-[10px] text-bank-gray-mid uppercase tracking-widest font-medium">
              Green Car Finance
            </span>
          </div>

          {/* Pre-qualified badge */}
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-5 h-5 text-green-deep"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm font-semibold text-green-deep">Pre-Qualified</span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest">Vehicle</p>
              <p className="text-sm font-medium text-bank-gray-dark">
                {vehicle?.model || score.model}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest">VIN</p>
              <p className="text-sm font-medium text-bank-gray-dark tabular-nums">
                {(vehicle?.vin || score.vin || '').slice(-6)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest">
                GreenDrive Score
              </p>
              <p className="text-sm font-semibold" style={{ color: score.tierColor }}>
                {score.totalScore}/100 — {score.tier}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest">Green Rate</p>
              <p className="text-sm font-semibold text-green-deep">{greenRate.toFixed(2)}%</p>
            </div>
          </div>

          {/* Validity */}
          <div className="pt-3 border-t border-green-deep/10">
            <p className="text-[10px] text-bank-gray-mid">
              Issued: {formatDate(today)} &middot; Valid until: {formatDate(validUntil)}
            </p>
            <p className="text-[10px] text-bank-gray mt-1">
              Ref: GD-
              {today.getFullYear()}
              {String(today.getMonth() + 1).padStart(2, '0')}
              {String(today.getDate()).padStart(2, '0')}-{(vehicle?.vin || '000000').slice(-4)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-pastel text-green-deep text-sm font-medium hover:bg-green-pale transition-colors"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {shared ? 'Copied!' : 'Share Certificate'}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-bank-gray-bg text-bank-gray-dark text-sm font-medium hover:bg-bank-gray-alt transition-colors"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>
      </div>
    </Card>
  );
}

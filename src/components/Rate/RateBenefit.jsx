import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';
import { BASE_RATE } from '../../utils/constants.js';

export default function RateBenefit({ score }) {
  if (!score) return null;

  const greenRate = BASE_RATE - score.rateReduction;

  return (
    <Card>
      <h3 className="section-title mb-5">Your Rate Benefit</h3>
      <div className="flex items-center gap-4">
        <div className="rate-card flex-1 text-center bg-bank-gray-bg">
          <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-2">
            Standard Rate
          </p>
          <p className="stat-value text-bank-gray-dark">{BASE_RATE.toFixed(2)}%</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-green-pastel flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-main"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
        <div
          className="rate-card flex-1 text-center bg-green-pastel"
          style={{ animationDelay: '0.1s' }}
        >
          <p className="text-[10px] text-green-deep uppercase tracking-widest mb-2">
            Your Green Rate
          </p>
          <p className="stat-value text-green-deep">
            <AnimatedNumber value={greenRate} decimals={2} suffix="%" />
          </p>
        </div>
      </div>
      {score.rateReduction > 0 && (
        <div className="callout mt-5">
          <p className="text-sm text-bank-gray-dark leading-relaxed">
            Your GreenDrive Score of <strong>{score.totalScore}/100</strong> qualifies you for the{' '}
            <strong style={{ color: score.tierColor }}>{score.tier}</strong> tier with a{' '}
            <strong>{score.rateReduction.toFixed(2)}%</strong> rate reduction on Green Car Loans.
            {score.suggestions?.length > 0 && (
              <>
                {' '}
                Potential improvement: {score.suggestions[0].action} for +
                {score.suggestions[0].potentialPoints} pts.
              </>
            )}
          </p>
        </div>
      )}

      {/* Banking CTA */}
      <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-green-deep to-[#0f8a5f] text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-sm">
              {score.rateReduction > 0
                ? "You're pre-qualified for a Green Car Loan"
                : 'Check your Green Car Loan eligibility'}
            </p>
            <p className="text-xs text-white/70 mt-1">
              {score.rateReduction > 0
                ? `Your ${score.tier} tier unlocks a ${greenRate.toFixed(2)}% rate — lower than standard auto financing.`
                : 'Improve your GreenDrive Score to unlock preferential rates.'}
            </p>
          </div>
          <button className="flex-shrink-0 px-5 py-2.5 bg-white text-green-deep rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </Card>
  );
}

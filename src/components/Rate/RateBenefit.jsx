import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';
import { BASE_RATE } from '../../utils/constants.js';

export default function RateBenefit({ score }) {
  if (!score) return null;

  const greenRate = BASE_RATE - score.rateReduction;

  return (
    <Card>
      <h3 className="text-sm font-medium text-bank-gray-dark mb-4">Your Rate Benefit</h3>
      <div className="flex gap-6">
        <div className="flex-1 text-center p-4 rounded-lg bg-bank-gray-bg">
          <p className="text-xs text-bank-gray-mid uppercase tracking-wider mb-1">Standard Rate</p>
          <p className="text-2xl font-medium text-bank-gray-dark">{BASE_RATE.toFixed(2)}%</p>
        </div>
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-green-main"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        <div className="flex-1 text-center p-4 rounded-lg bg-green-pastel">
          <p className="text-xs text-green-deep uppercase tracking-wider mb-1">Your Green Rate</p>
          <p className="text-2xl font-medium text-green-deep">
            <AnimatedNumber value={greenRate} decimals={2} suffix="%" />
          </p>
        </div>
      </div>
      {score.rateReduction > 0 && (
        <div className="callout mt-4">
          <p className="text-sm text-bank-gray-dark">
            Your GreenDrive Score of <strong>{score.totalScore}/100</strong> qualifies you for the{' '}
            <strong style={{ color: score.tierColor }}>{score.tier}</strong> tier with a{' '}
            <strong>{score.rateReduction.toFixed(2)}%</strong> rate reduction.
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
    </Card>
  );
}

import { BASE_RATE } from '../../utils/constants.js';
import GreenCallout from '../shared/GreenCallout.jsx';

export default function GreenRateTeaser({ score, onViewRateDetails }) {
  if (!score || !score.rateReduction || score.rateReduction <= 0) return null;

  const greenRate = (BASE_RATE - score.rateReduction).toFixed(2);

  return (
    <GreenCallout icon="M13 7l5 5m0 0l-5 5m5-5H6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-bank-gray-mid line-through">{BASE_RATE.toFixed(2)}%</span>
          <span className="text-xl font-semibold text-green-deep">{greenRate}%</span>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <p className="text-sm text-bank-gray-dark">
            Your <strong style={{ color: score.tierColor }}>{score.tier}</strong> tier saves you{' '}
            <strong className="text-green-deep">{score.rateReduction.toFixed(2)}%</strong> on Green
            Car Loans
          </p>
          <button
            onClick={onViewRateDetails}
            className="flex-shrink-0 text-sm font-medium text-green-deep hover:text-green-main transition-colors"
          >
            View Rate Details &rarr;
          </button>
        </div>
      </div>
    </GreenCallout>
  );
}

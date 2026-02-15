export default function ChargingRateImpact({ score, charging, onViewRateDetails }) {
  if (!score || !score.rateReduction || score.rateReduction <= 0) return null;

  const homeChargingPct = charging?.patterns?.home || 0;
  const chargingScore = score.breakdown?.chargingBehavior?.score || 0;
  const chargingMax = score.breakdown?.chargingBehavior?.max || 25;

  return (
    <div className="bg-green-pastel border-l-3 border-green-deep rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-green-deep/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            className="w-4 h-4 text-green-deep"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-deep mb-1">
            Your Charging Earns You a Better Rate
          </p>
          <p className="text-sm text-bank-gray-dark leading-relaxed">
            {homeChargingPct}% home charging scores{' '}
            <strong>
              {chargingScore}/{chargingMax}
            </strong>{' '}
            pts, contributing to your{' '}
            <strong style={{ color: score.tierColor }}>{score.tier}</strong> tier and{' '}
            <strong className="text-green-deep">{score.rateReduction.toFixed(2)}%</strong> rate
            reduction.
          </p>
          <button
            onClick={onViewRateDetails}
            className="mt-2 text-sm font-medium text-green-deep hover:text-green-main transition-colors"
          >
            See full rate impact &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

import GreenCallout from '../shared/GreenCallout.jsx';

export default function ChargingRateImpact({ score, charging, onViewRateDetails }) {
  if (!score || !score.rateReduction || score.rateReduction <= 0) return null;

  const homeChargingPct = charging?.patterns?.home || 0;
  const chargingScore = score.breakdown?.chargingBehavior?.score || 0;
  const chargingMax = score.breakdown?.chargingBehavior?.max || 25;

  return (
    <GreenCallout icon="M13 10V3L4 14h7v7l9-11h-7z">
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
    </GreenCallout>
  );
}

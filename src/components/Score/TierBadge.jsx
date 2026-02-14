export default function TierBadge({ tier, tierColor, rateReduction }) {
  return (
    <div className="flex flex-col items-center gap-2.5 mt-2">
      <span
        className="px-5 py-1.5 rounded-full text-sm font-medium text-white shadow-sm"
        style={{ backgroundColor: tierColor, boxShadow: `0 2px 8px ${tierColor}40` }}
      >
        {tier}
      </span>
      {rateReduction > 0 && (
        <p className="text-xs text-bank-gray-mid tracking-wide">
          <span className="font-medium text-green-deep">{rateReduction.toFixed(2)}%</span> rate
          reduction
        </p>
      )}
    </div>
  );
}

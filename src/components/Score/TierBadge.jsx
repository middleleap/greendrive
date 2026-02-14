export default function TierBadge({ tier, tierColor, rateReduction }) {
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <span
        className="px-4 py-1.5 rounded-full text-sm font-medium text-white"
        style={{ backgroundColor: tierColor }}
      >
        {tier}
      </span>
      {rateReduction > 0 && (
        <p className="text-xs text-adcb-gray-mid">
          {rateReduction.toFixed(2)}% rate reduction
        </p>
      )}
    </div>
  );
}

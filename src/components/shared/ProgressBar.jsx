export default function ProgressBar({ value, max, color = '#16A34A', delay = 0, label, detail }) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="mb-3">
      {label && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-bank-gray-dark font-medium">{label}</span>
          <span className="text-bank-gray-mid">{value}/{max}</span>
        </div>
      )}
      <div className="h-2.5 bg-bank-gray-alt rounded-full overflow-hidden">
        <div
          className="progress-bar-fill h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            animationDelay: `${delay}ms`,
          }}
        />
      </div>
      {detail && <p className="text-xs text-bank-gray-mid mt-1">{detail}</p>}
    </div>
  );
}

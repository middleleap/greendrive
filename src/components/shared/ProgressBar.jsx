export default function ProgressBar({
  value,
  max,
  color = '#16A34A',
  delay = 0,
  label,
  detail,
  icon,
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="mb-3.5 group">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-2 text-sm">
            {icon && (
              <svg
                className="w-3.5 h-3.5 text-bank-gray opacity-50 group-hover:opacity-80 transition-opacity"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={icon} />
              </svg>
            )}
            <span className="text-bank-gray-dark font-medium">{label}</span>
          </span>
          <span className="text-xs text-bank-gray-mid tabular-nums">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-2 bg-bank-gray-alt/50 rounded-full overflow-hidden">
        <div
          className="progress-bar-fill h-full rounded-full"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            animationDelay: `${delay}ms`,
          }}
        />
      </div>
      {detail && <p className="text-xs text-bank-gray-mid mt-1 ml-5.5">{detail}</p>}
    </div>
  );
}

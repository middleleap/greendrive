import { useState } from 'react';

export default function ProgressBar({
  value,
  max,
  color = 'var(--color-green-main)',
  delay = 0,
  label,
  detail,
  icon,
  badge,
  guidance,
}) {
  const [showGuidance, setShowGuidance] = useState(false);
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
            {guidance && (
              <button
                onClick={() => setShowGuidance((g) => !g)}
                className="text-bank-gray-mid hover:text-bank-gray-dark transition-colors"
                aria-label={`${showGuidance ? 'Hide' : 'Show'} scoring details for ${label}`}
                aria-expanded={showGuidance}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
              </button>
            )}
          </span>
          <span className="flex items-center gap-2">
            {badge && (
              <span className="text-[10px] font-medium text-bank-gray-mid bg-bank-gray-bg px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            <span className="text-xs text-bank-gray-mid tabular-nums">
              {value}/{max}
            </span>
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
      {guidance && showGuidance && (
        <div className="mt-2 ml-5.5 p-2.5 rounded-lg bg-bank-gray-bg text-xs text-bank-gray-mid leading-relaxed">
          {guidance}
        </div>
      )}
    </div>
  );
}

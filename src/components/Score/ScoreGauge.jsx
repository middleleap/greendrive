import AnimatedNumber from '../shared/AnimatedNumber.jsx';

const SIZE = 220;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreGauge({ score, maxScore = 100, tierColor = '#16A34A' }) {
  const pct = maxScore > 0 ? score / maxScore : 0;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <div className="relative flex flex-col items-center py-2" role="meter" aria-valuenow={score} aria-valuemin={0} aria-valuemax={maxScore} aria-label={`GreenDrive Score: ${score} out of ${maxScore}`}>
      {/* Radial glow backdrop */}
      <div
        className="gauge-backdrop"
        style={{ '--glow-color': `${tierColor}12`, width: 200, height: 200 }}
      />

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="transform -rotate-90 gauge-glow"
        style={{ '--glow-color': `${tierColor}50` }}
      >
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={tierColor} stopOpacity="0.6" />
            <stop offset="50%" stopColor={tierColor} />
            <stop offset="100%" stopColor={tierColor} stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-bank-gray-alt)"
          strokeWidth={STROKE}
          opacity="0.5"
        />

        {/* Score arc */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          className="gauge-circle"
          style={{
            '--gauge-circumference': CIRCUMFERENCE,
            '--gauge-offset': offset,
          }}
        />
      </svg>

      {/* Center content */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: SIZE, height: SIZE }}
      >
        <span className="gauge-label text-bank-gray-mid mb-1">GreenDrive Score</span>
        <span className="gauge-number text-bank-gray-dark">
          <AnimatedNumber value={score} />
        </span>
        <span className="text-sm text-bank-gray mt-0.5">of {maxScore}</span>
      </div>
    </div>
  );
}

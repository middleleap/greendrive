import AnimatedNumber from '../shared/AnimatedNumber.jsx';

const SIZE = 200;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreGauge({ score, maxScore = 100, tierColor = '#16A34A' }) {
  const pct = maxScore > 0 ? score / maxScore : 0;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          fill="none" stroke="#E4E4E4" strokeWidth={STROKE}
        />
        {/* Score arc */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          fill="none" stroke={tierColor} strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          className="gauge-circle"
          style={{
            '--gauge-circumference': CIRCUMFERENCE,
            '--gauge-offset': offset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: SIZE, height: SIZE }}>
        <span className="text-4xl font-medium text-bank-gray-dark">
          <AnimatedNumber value={score} />
        </span>
        <span className="text-sm text-bank-gray-mid">/ {maxScore}</span>
      </div>
    </div>
  );
}

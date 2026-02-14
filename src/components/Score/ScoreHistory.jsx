import { useState, useEffect } from 'react';
import Card from '../shared/Card.jsx';
import { TIERS } from '../../utils/constants.js';

const STORAGE_KEY = 'greendrive_score_history';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

// Generate realistic mock history if empty
function generateMockHistory(currentScore) {
  const history = [];
  const now = Date.now();
  const dayMs = 86400000;

  // 12 data points over 90 days showing gradual improvement
  for (let i = 11; i >= 0; i--) {
    const daysAgo = i * 8;
    const baseScore = Math.max(35, currentScore - 30 + Math.floor((11 - i) * (30 / 11)));
    const jitter = Math.floor(Math.random() * 5) - 2;
    const score = Math.min(100, Math.max(0, baseScore + jitter));
    history.push({
      date: new Date(now - daysAgo * dayMs).toISOString().split('T')[0],
      score,
      tier: TIERS.find((t) => score >= t.minScore && score <= t.maxScore)?.name || 'Standard',
    });
  }
  return history;
}

export default function ScoreHistory({ currentScore, currentTier, tierColor }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let stored = getHistory();

    // Seed with mock history on first visit
    if (stored.length === 0) {
      stored = generateMockHistory(currentScore || 78);
      saveHistory(stored);
    }

    // Add today's score if not already present
    const today = new Date().toISOString().split('T')[0];
    const hasToday = stored.some((h) => h.date === today);
    if (!hasToday && currentScore != null) {
      stored.push({ date: today, score: currentScore, tier: currentTier || 'Standard' });
      saveHistory(stored);
    }

    setHistory(stored.slice(-12)); // Keep last 12 entries
  }, [currentScore, currentTier]);

  if (history.length < 2) return null;

  const scores = history.map((h) => h.score);
  const minScore = Math.max(0, Math.min(...scores) - 10);
  const maxScore = Math.min(100, Math.max(...scores) + 10);
  const range = maxScore - minScore || 1;

  // SVG dimensions
  const W = 480;
  const H = 160;
  const padX = 36;
  const padY = 20;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const points = history.map((h, i) => ({
    x: padX + (i / (history.length - 1)) * chartW,
    y: padY + chartH - ((h.score - minScore) / range) * chartH,
    ...h,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L${points[points.length - 1].x},${padY + chartH} L${points[0].x},${padY + chartH} Z`;

  // Tier boundary lines
  const tierLines = TIERS.filter((t) => t.minScore > minScore && t.minScore < maxScore).map(
    (t) => ({
      y: padY + chartH - ((t.minScore - minScore) / range) * chartH,
      name: t.name,
      color: t.color,
    })
  );

  const scoreDelta = scores[scores.length - 1] - scores[0];

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <h3 className="section-title">Score History</h3>
        <div className="flex items-center gap-1.5">
          {scoreDelta !== 0 && (
            <span
              className={`text-xs font-medium ${scoreDelta > 0 ? 'text-green-deep' : 'text-bank-red'}`}
            >
              {scoreDelta > 0 ? '+' : ''}
              {scoreDelta} pts
            </span>
          )}
          <span className="text-[10px] text-bank-gray-mid">last 90 days</span>
        </div>
      </div>
      <p className="text-xs text-bank-gray-mid mb-4">
        Track your GreenDrive Score trend and its impact on your rate
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padY + chartH * (1 - pct);
          const val = Math.round(minScore + range * pct);
          return (
            <g key={pct}>
              <line
                x1={padX}
                y1={y}
                x2={W - padX}
                y2={y}
                stroke="var(--color-bank-gray-alt)"
                strokeWidth="0.5"
                strokeDasharray="4,3"
              />
              <text
                x={padX - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-bank-gray text-[9px]"
                style={{ fontFamily: 'inherit' }}
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Tier boundary lines */}
        {tierLines.map((tl) => (
          <g key={tl.name}>
            <line
              x1={padX}
              y1={tl.y}
              x2={W - padX}
              y2={tl.y}
              stroke={tl.color}
              strokeWidth="0.75"
              strokeDasharray="6,4"
              opacity="0.4"
            />
            <text
              x={W - padX + 2}
              y={tl.y + 3}
              className="text-[8px]"
              style={{ fill: tl.color, fontFamily: 'inherit' }}
            >
              {tl.name.split(' ')[0]}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <defs>
          <linearGradient id="score-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tierColor || '#16A34A'} stopOpacity="0.2" />
            <stop offset="100%" stopColor={tierColor || '#16A34A'} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#score-area-grad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke={tierColor || '#16A34A'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={tierColor || '#16A34A'} />
            <circle cx={p.x} cy={p.y} r="2" fill="white" />
            {/* Date labels for first, middle, last */}
            {(i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2)) && (
              <text
                x={p.x}
                y={padY + chartH + 14}
                textAnchor="middle"
                className="fill-bank-gray text-[9px]"
                style={{ fontFamily: 'inherit' }}
              >
                {new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </text>
            )}
          </g>
        ))}
      </svg>
    </Card>
  );
}

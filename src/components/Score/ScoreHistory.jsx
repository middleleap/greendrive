import { useState, useEffect, useMemo } from 'react';
import { API_BASE } from '../../utils/constants.js';
import Card from '../shared/Card.jsx';

const PERIODS = [
  { key: 'week', label: '7D' },
  { key: 'month', label: '30D' },
  { key: 'quarter', label: '90D' },
];

// Chart dimensions
const W = 600;
const H = 200;
const PAD = { top: 20, right: 16, bottom: 32, left: 40 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

// Tier bands for background shading
const TIER_BANDS = [
  { min: 85, max: 100, color: '#0A6847', label: 'Platinum' },
  { min: 70, max: 84, color: '#16A34A', label: 'Gold' },
  { min: 55, max: 69, color: '#22C55E', label: 'Silver' },
  { min: 40, max: 54, color: '#F26B43', label: 'Bronze' },
  { min: 0, max: 39, color: '#A5A5A5', label: 'Standard' },
];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function ScoreHistory({ vin }) {
  const [period, setPeriod] = useState('quarter');
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    if (!vin) return;
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/score-history/${vin}?period=${period}`, {
          signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) setHistoryData(data);
      } catch {
        if (!cancelled) setHistoryData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [vin, period]);

  const points = historyData?.history || [];
  const stats = historyData?.stats;
  const trend = historyData?.trend;

  // Compute SVG path data
  const { linePath, areaPath, dots, yTicks, xLabels } = useMemo(() => {
    if (points.length < 2) {
      return { linePath: '', areaPath: '', dots: [], yTicks: [], xLabels: [] };
    }

    const scores = points.map((p) => p.totalScore);
    const minY = Math.max(0, Math.min(...scores) - 5);
    const maxY = Math.min(100, Math.max(...scores) + 5);
    const rangeY = maxY - minY || 1;

    const toX = (i) => PAD.left + (i / (points.length - 1)) * PLOT_W;
    const toY = (score) => PAD.top + PLOT_H - ((score - minY) / rangeY) * PLOT_H;

    const dotList = points.map((p, i) => ({
      x: toX(i),
      y: toY(p.totalScore),
      score: p.totalScore,
      tier: p.tier,
      date: p.computedAt,
      index: i,
    }));

    const lineCoords = dotList.map((d) => `${d.x},${d.y}`).join(' L');
    const line = `M${lineCoords}`;
    const area = `${line} L${toX(points.length - 1)},${PAD.top + PLOT_H} L${PAD.left},${PAD.top + PLOT_H} Z`;

    // Y-axis ticks (5 evenly spaced)
    const yTickCount = 5;
    const yTickList = Array.from({ length: yTickCount }, (_, i) => {
      const val = Math.round(minY + (rangeY * i) / (yTickCount - 1));
      return { val, y: toY(val) };
    });

    // X-axis labels (up to 6 evenly spaced dates)
    const labelCount = Math.min(6, points.length);
    const xLabelList = Array.from({ length: labelCount }, (_, i) => {
      const idx = Math.round((i / (labelCount - 1)) * (points.length - 1));
      return { label: formatDate(points[idx].computedAt), x: toX(idx) };
    });

    return { linePath: line, areaPath: area, dots: dotList, yTicks: yTickList, xLabels: xLabelList };
  }, [points]);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Score History</h3>
        </div>
        <div className="h-[232px] flex items-center justify-center">
          <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
        </div>
      </Card>
    );
  }

  if (!historyData || points.length < 2) {
    return (
      <Card>
        <h3 className="section-title mb-3">Score History</h3>
        <p className="text-sm text-bank-gray-mid">
          Not enough data yet. Score snapshots are recorded each time the dashboard loads.
        </p>
      </Card>
    );
  }

  const latestScore = points[points.length - 1]?.totalScore;
  const firstScore = points[0]?.totalScore;
  const totalChange = latestScore - firstScore;

  return (
    <Card>
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="section-title">Score History</h3>
        <div className="flex items-center gap-1 bg-bank-gray-bg rounded-lg p-0.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                period === p.key
                  ? 'bg-bank-surface text-bank-gray-dark shadow-sm'
                  : 'text-bank-gray-mid hover:text-bank-gray-dark'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trend summary */}
      <div className="flex items-center gap-4 mb-3">
        {trend && (
          <span
            className={`text-xs font-medium flex items-center gap-1 ${
              trend.direction === 'up'
                ? 'text-green-deep'
                : trend.direction === 'down'
                  ? 'text-bank-red'
                  : 'text-bank-gray-mid'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {trend.direction === 'up' ? (
                <path d="M18 15l-6-6-6 6" />
              ) : trend.direction === 'down' ? (
                <path d="M6 9l6 6 6-6" />
              ) : (
                <path d="M5 12h14" />
              )}
            </svg>
            {trend.direction === 'up' ? '+' : ''}{trend.delta} pts vs prior week
          </span>
        )}
        {totalChange !== 0 && (
          <span className="text-xs text-bank-gray-mid">
            {totalChange > 0 ? '+' : ''}{totalChange} pts over period
          </span>
        )}
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ maxHeight: 232 }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <g key={tick.val}>
              <line
                x1={PAD.left}
                y1={tick.y}
                x2={W - PAD.right}
                y2={tick.y}
                stroke="var(--color-bank-gray-alt)"
                strokeWidth="0.5"
                strokeDasharray="4 3"
              />
              <text
                x={PAD.left - 8}
                y={tick.y + 3.5}
                textAnchor="end"
                fontSize="10"
                fill="var(--color-bank-gray-mid)"
                fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#historyGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-green-main)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-green-main)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-green-main)" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Hover targets — invisible wider rects for each point */}
          {dots.map((dot) => (
            <rect
              key={dot.index}
              x={dot.x - (PLOT_W / points.length) / 2}
              y={PAD.top}
              width={PLOT_W / points.length}
              height={PLOT_H}
              fill="transparent"
              onMouseEnter={() => setHoveredPoint(dot)}
            />
          ))}

          {/* Hovered point indicator */}
          {hoveredPoint && (
            <>
              <line
                x1={hoveredPoint.x}
                y1={PAD.top}
                x2={hoveredPoint.x}
                y2={PAD.top + PLOT_H}
                stroke="var(--color-bank-gray)"
                strokeWidth="0.5"
                strokeDasharray="3 2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="4"
                fill="var(--color-green-main)"
                stroke="var(--color-bank-surface)"
                strokeWidth="2"
              />
            </>
          )}

          {/* X-axis labels */}
          {xLabels.map((l, i) => (
            <text
              key={i}
              x={l.x}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fill="var(--color-bank-gray-mid)"
              fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
            >
              {l.label}
            </text>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none bg-bank-surface border border-bank-gray-alt rounded-lg shadow-lg px-3 py-2 text-xs transition-opacity duration-150"
            style={{
              left: `${(hoveredPoint.x / W) * 100}%`,
              top: `${(hoveredPoint.y / H) * 100 - 16}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-semibold text-bank-gray-dark">{hoveredPoint.score}/100</p>
            <p className="text-bank-gray-mid">{hoveredPoint.tier}</p>
            <p className="text-bank-gray">{formatDate(hoveredPoint.date)}</p>
          </div>
        )}
      </div>

      {/* Stats row */}
      {stats && stats.totalSnapshots > 1 && (
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-bank-gray-alt">
          <StatMini label="Avg" value={stats.avgScore} />
          <StatMini label="High" value={stats.highestScore} highlight />
          <StatMini label="Low" value={stats.lowestScore} />
          <StatMini label="Records" value={stats.totalSnapshots} plain />
        </div>
      )}
    </Card>
  );
}

function StatMini({ label, value, highlight = false, plain = false }) {
  return (
    <div className="text-center">
      <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-0.5">{label}</p>
      <p
        className={`text-lg font-semibold ${
          highlight ? 'text-green-deep' : plain ? 'text-bank-gray-dark' : 'text-bank-gray-dark'
        }`}
      >
        {value != null ? (plain ? value : `${value}`) : '—'}
      </p>
    </div>
  );
}

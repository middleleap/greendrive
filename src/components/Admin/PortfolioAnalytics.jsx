import { useState, useEffect } from 'react';
import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';
import { API_BASE } from '../../utils/constants.js';

// Static portfolio data representing projected bank-wide statistics.
// Tier distribution and average score are supplemented with real DB data when available.
const STATIC_PORTFOLIO = {
  totalCustomers: 1247,
  totalLoanValue: 312500000,
  conversionRate: 34.2,
  conversionFunnel: [
    { stage: 'Connected Vehicle', count: 1247, pct: 100 },
    { stage: 'Score Generated', count: 1189, pct: 95.3 },
    { stage: 'Pre-Qualified', count: 821, pct: 65.8 },
    { stage: 'Applied', count: 427, pct: 34.2 },
    { stage: 'Approved', count: 389, pct: 31.2 },
    { stage: 'Disbursed', count: 341, pct: 27.3 },
  ],
  monthlyTrend: [
    { month: 'Sep', customers: 210, avgScore: 61 },
    { month: 'Oct', customers: 384, avgScore: 63 },
    { month: 'Nov', customers: 567, avgScore: 65 },
    { month: 'Dec', customers: 742, avgScore: 66 },
    { month: 'Jan', customers: 1003, avgScore: 67 },
    { month: 'Feb', customers: 1247, avgScore: 68 },
  ],
  riskMetrics: {
    avgDPD: 2.1,
    nplRate: 0.3,
    greenVsStandard: -42,
  },
  tierDistribution: [
    { name: 'Platinum Green', count: 89, pct: 7.1, color: '#0A6847' },
    { name: 'Gold Green', count: 312, pct: 25.0, color: '#16A34A' },
    { name: 'Silver Green', count: 421, pct: 33.8, color: '#22C55E' },
    { name: 'Bronze Green', count: 287, pct: 23.0, color: '#F26B43' },
    { name: 'Standard', count: 138, pct: 11.1, color: '#A5A5A5' },
  ],
  avgScore: 68,
};

function usePortfolioStats() {
  const [data, setData] = useState(STATIC_PORTFOLIO);
  useEffect(() => {
    fetch(`${API_BASE}/api/portfolio-stats`, { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((live) => {
        if (live.connectedVehicles > 0) {
          setData((prev) => ({
            ...prev,
            avgScore: live.avgScore,
            tierDistribution: live.tierDistribution,
            liveVehicles: live.connectedVehicles,
          }));
        }
      })
      .catch(() => {});
  }, []);
  return data;
}

export default function PortfolioAnalytics() {
  const PORTFOLIO = usePortfolioStats();
  const maxFunnelCount = PORTFOLIO.conversionFunnel[0].count;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-1">
        <KpiCard
          label="Connected Customers"
          value={PORTFOLIO.totalCustomers}
          color="text-bank-gray-dark"
        />
        <KpiCard
          label="Avg GreenDrive Score"
          value={PORTFOLIO.avgScore}
          suffix="/100"
          color="text-green-deep"
        />
        <KpiCard
          label="Portfolio Value"
          value={PORTFOLIO.totalLoanValue / 1000000}
          prefix="AED "
          suffix="M"
          decimals={1}
          color="text-bank-gray-dark"
        />
        <KpiCard
          label="Conversion Rate"
          value={PORTFOLIO.conversionRate}
          suffix="%"
          decimals={1}
          color="text-green-deep"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tier Distribution */}
        <Card className="stagger-2">
          <h3 className="section-title mb-4">Tier Distribution</h3>
          <div className="space-y-3">
            {PORTFOLIO.tierDistribution.map((tier) => (
              <div key={tier.name}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-bank-gray-mid flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: tier.color }}
                    />
                    {tier.name}
                  </span>
                  <span className="text-xs text-bank-gray-dark font-medium tabular-nums">
                    {tier.count} ({tier.pct}%)
                  </span>
                </div>
                <div className="h-2 bg-bank-gray-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${tier.pct}%`, backgroundColor: tier.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-green-pastel">
            <p className="text-xs text-green-deep">
              <strong>{(100 - PORTFOLIO.tierDistribution[4].pct).toFixed(1)}%</strong> of connected
              customers qualify for a rate reduction
            </p>
          </div>
        </Card>

        {/* Conversion Funnel */}
        <Card className="stagger-3">
          <h3 className="section-title mb-4">Conversion Funnel</h3>
          <div className="space-y-2">
            {PORTFOLIO.conversionFunnel.map((stage, i) => {
              const widthPct = (stage.count / maxFunnelCount) * 100;
              const dropOff =
                i > 0
                  ? (
                      ((PORTFOLIO.conversionFunnel[i - 1].count - stage.count) /
                        PORTFOLIO.conversionFunnel[i - 1].count) *
                      100
                    ).toFixed(1)
                  : null;
              return (
                <div key={stage.stage}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-bank-gray-mid">{stage.stage}</span>
                    <span className="text-xs text-bank-gray-dark font-medium tabular-nums">
                      {stage.count.toLocaleString()}
                      {dropOff && (
                        <span className="text-bank-orange ml-1.5 text-[10px]">-{dropOff}%</span>
                      )}
                    </span>
                  </div>
                  <div className="h-6 bg-bank-gray-bg rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-700"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: i < 3 ? '#16A34A' : '#0A6847',
                        opacity: 0.15 + (i / PORTFOLIO.conversionFunnel.length) * 0.85,
                      }}
                    >
                      <span className="text-[10px] font-medium text-bank-gray-dark tabular-nums">
                        {stage.pct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Growth Trend */}
        <Card className="stagger-4">
          <h3 className="section-title mb-4">Growth Trend</h3>
          <GrowthChart data={PORTFOLIO.monthlyTrend} />
        </Card>

        {/* Risk Metrics */}
        <Card className="stagger-5">
          <h3 className="section-title mb-4">Portfolio Risk Metrics</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-green-pastel">
              <p className="text-[10px] text-green-deep/70 uppercase tracking-widest font-medium mb-1">
                Green vs Standard Default Rate
              </p>
              <p className="text-2xl font-semibold text-green-deep">
                {PORTFOLIO.riskMetrics.greenVsStandard}%
              </p>
              <p className="text-xs text-green-deep/70 mt-1">
                Green Car Loan holders default 42% less frequently than standard auto loan customers
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-bank-gray-bg">
                <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest font-medium mb-1">
                  Avg Days Past Due
                </p>
                <p className="text-xl font-semibold text-bank-gray-dark">
                  {PORTFOLIO.riskMetrics.avgDPD}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-bank-gray-bg">
                <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest font-medium mb-1">
                  NPL Rate
                </p>
                <p className="text-xl font-semibold text-bank-gray-dark">
                  {PORTFOLIO.riskMetrics.nplRate}%
                </p>
              </div>
            </div>

            <div className="callout">
              <p className="text-xs text-bank-gray-dark leading-relaxed">
                <strong>Key Insight:</strong> GreenDrive-scored customers show significantly lower
                credit risk. EV ownership patterns correlate with financial discipline — data
                supports extending the programme to broader green finance products.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ label, value, prefix = '', suffix = '', decimals = 0, color }) {
  return (
    <Card>
      <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest font-medium mb-2">
        {label}
      </p>
      <p className={`text-2xl font-semibold ${color}`}>
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </p>
    </Card>
  );
}

function GrowthChart({ data }) {
  const W = 400;
  const H = 140;
  const padX = 40;
  const padY = 16;
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const maxCustomers = Math.max(...data.map((d) => d.customers));

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padY + chartH - (d.customers / maxCustomers) * chartH,
    ...d,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L${points[points.length - 1].x},${padY + chartH} L${points[0].x},${padY + chartH} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        <defs>
          <linearGradient id="growth-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16A34A" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((pct) => {
          const y = padY + chartH * (1 - pct);
          return (
            <line
              key={pct}
              x1={padX}
              y1={y}
              x2={W - padX}
              y2={y}
              stroke="var(--color-bank-gray-alt)"
              strokeWidth="0.5"
              strokeDasharray="4,3"
            />
          );
        })}

        <path d={areaD} fill="url(#growth-grad)" />
        <path d={pathD} fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" />

        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#16A34A" />
            <circle cx={p.x} cy={p.y} r="2" fill="var(--color-bank-surface)" />
            <text
              x={p.x}
              y={padY + chartH + 14}
              textAnchor="middle"
              className="fill-bank-gray text-[9px]"
              style={{ fontFamily: 'inherit' }}
            >
              {p.month}
            </text>
            <text
              x={p.x}
              y={p.y - 8}
              textAnchor="middle"
              className="fill-bank-gray-dark text-[9px]"
              style={{ fontFamily: 'inherit', fontWeight: 500 }}
            >
              {p.customers.toLocaleString()}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-bank-gray-mid mt-1 px-2">
        <span>Connected Customers</span>
        <span className="text-green-deep font-medium">
          +
          {Math.round(
            ((data[data.length - 1].customers - data[0].customers) / data[0].customers) * 100,
          )}
          % growth
        </span>
      </div>
    </div>
  );
}

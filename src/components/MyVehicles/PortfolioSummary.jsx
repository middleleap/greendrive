import { getPortfolioSummary } from '../../utils/my-vehicles-data.js';

export default function PortfolioSummary({ fleet }) {
  const summary = getPortfolioSummary(fleet);

  return (
    <div className="mv-portfolio-card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/60">Vehicle Portfolio</p>
          <p className="text-xl font-semibold text-white mt-0.5">
            AED {summary.totalValue.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4 text-white/40"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
          >
            <polygon points="50,5 95,95 5,95" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-lg font-semibold text-white">{summary.vehicleCount}</p>
          <p className="text-[9px] uppercase tracking-wider text-white/50">Vehicles</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-white">
            {(summary.annualInsurance / 1000).toFixed(1)}K
          </p>
          <p className="text-[9px] uppercase tracking-wider text-white/50">Insurance/yr</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-white">{summary.connectedRatio}</p>
          <p className="text-[9px] uppercase tracking-wider text-white/50">Connected</p>
        </div>
      </div>
    </div>
  );
}

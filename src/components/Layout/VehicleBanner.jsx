import { useState } from 'react';
import { formatKm, formatPercent } from '../../utils/format.js';
import { BASE_RATE } from '../../utils/constants.js';

const CHARGING_STATE_MAP = {
  Disconnected: { label: 'Not Plugged In', info: 'Vehicle is not connected to a charger. This is normal when parked.' },
  Stopped: { label: 'Charge Paused', info: 'Charging is paused, possibly due to a schedule or charge limit setting.' },
  Charging: { label: 'Charging', info: 'Your vehicle is actively charging.' },
  Complete: { label: 'Charge Complete', info: 'Battery has reached its charge limit.' },
  NoPower: { label: 'No Power', info: 'Charger is connected but not providing power.' },
};

function formatChargingState(rawState) {
  const mapped = CHARGING_STATE_MAP[rawState];
  return mapped || { label: rawState || 'Unknown', info: 'Current charging state of your vehicle.' };
}

export default function VehicleBanner({ vehicle, score, vehicles, selectedVin, onSelectVehicle }) {
  const [showMore, setShowMore] = useState(false);

  if (!vehicle) return null;

  const greenRate = score?.rateReduction ? (BASE_RATE - score.rateReduction).toFixed(2) : null;
  const hasMultiple = vehicles && vehicles.length > 1;
  const chargingInfo = formatChargingState(vehicle.battery?.charging);

  const primaryStats = [
    greenRate && { label: 'Green Rate', value: `${greenRate}%`, highlighted: true },
    { label: 'Battery', value: formatPercent(vehicle.battery?.level) },
    { label: 'Range', value: formatKm(vehicle.battery?.range_km) },
  ].filter(Boolean);

  const secondaryStats = [
    { label: 'Odometer', value: formatKm(vehicle.odometer?.km) },
    { label: 'Charge State', value: chargingInfo.label, tooltip: chargingInfo.info },
  ];

  return (
    <div className="banner-pattern bg-gradient-to-r from-bank-teal to-[#1a2c34] text-white">
      <div className="max-w-7xl mx-auto px-6 py-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <img src="/assets/logos/default-2.svg" alt="" className="h-5 opacity-80" />
              {hasMultiple ? (
                <div className="relative">
                  <select
                    value={selectedVin || vehicle.vin}
                    onChange={(e) => onSelectVehicle(e.target.value)}
                    className="vehicle-selector appearance-none bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 pr-8 text-xl font-semibold tracking-tight text-white cursor-pointer hover:bg-white/15 transition-colors"
                  >
                    {vehicles.map((v) => (
                      <option key={v.vin} value={v.vin} className="text-bank-gray-dark bg-white">
                        {v.displayName}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              ) : (
                <h1 className="text-2xl font-semibold tracking-tight">{vehicle.displayName}</h1>
              )}
              {score?.tier && score.rateReduction > 0 && (
                <span
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${score.tierColor}30`,
                    color: score.tierColor,
                    border: `1px solid ${score.tierColor}50`,
                  }}
                >
                  {score.tier}
                </span>
              )}
            </div>
            <p className="text-sm text-white/80 tracking-wide">
              {vehicle.model} &middot; {vehicle.vin} &middot; v{vehicle.software}
            </p>
            {hasMultiple && (
              <p className="text-[11px] text-white/60 mt-1">
                {vehicles.length} vehicles in family fleet
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {/* Primary stats — always visible */}
            {primaryStats.map((s) => (
              <GlassStat
                key={s.label}
                label={s.label}
                value={s.value}
                highlighted={s.highlighted}
              />
            ))}

            {/* Secondary stats — always visible on desktop, toggle on mobile */}
            {secondaryStats.map((s) => (
              <GlassStat
                key={s.label}
                label={s.label}
                value={s.value}
                tooltip={s.tooltip}
                className={`hidden sm:block ${showMore ? '!block' : ''}`}
              />
            ))}

            {/* Mobile toggle */}
            <button
              onClick={() => setShowMore((v) => !v)}
              className="glass-stat min-w-[50px] flex items-center justify-center sm:hidden"
              aria-label={showMore ? 'Show fewer stats' : 'Show more stats'}
            >
              <svg
                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassStat({ label, value, highlighted, className = '', tooltip }) {
  return (
    <div
      className={`glass-stat min-w-[90px] ${highlighted ? 'bg-green-deep/30 border-green-light/30' : ''} ${className}`}
      title={tooltip || undefined}
    >
      <p className="text-white/70 text-[11px] uppercase tracking-widest font-medium mb-0.5 flex items-center gap-1">
        {label}
        {tooltip && (
          <svg className="w-3 h-3 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        )}
      </p>
      <p className={`font-semibold text-sm ${highlighted ? 'text-green-light' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

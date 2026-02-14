import { formatKm, formatPercent } from '../../utils/format.js';

export default function VehicleBanner({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="banner-pattern bg-gradient-to-r from-bank-teal to-[#1a2c34] text-white">
      <div className="max-w-7xl mx-auto px-6 py-7">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <img src="/assets/logos/default-2.svg" alt="" className="h-5 opacity-80" />
              <h1 className="text-2xl font-semibold tracking-tight">{vehicle.displayName}</h1>
            </div>
            <p className="text-sm text-white/70 tracking-wide">
              {vehicle.model} &middot; {vehicle.vin} &middot; v{vehicle.software}
            </p>
          </div>
          <div className="flex gap-3">
            <GlassStat label="Odometer" value={formatKm(vehicle.odometer?.km)} />
            <GlassStat label="Battery" value={formatPercent(vehicle.battery?.level)} />
            <GlassStat label="Range" value={formatKm(vehicle.battery?.range_km)} />
            <GlassStat label="State" value={vehicle.battery?.charging || 'Unknown'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassStat({ label, value }) {
  return (
    <div className="glass-stat min-w-[90px]">
      <p className="text-white/70 text-[11px] uppercase tracking-widest font-medium mb-0.5">{label}</p>
      <p className="font-semibold text-sm text-white">{value}</p>
    </div>
  );
}

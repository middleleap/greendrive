import { formatKm, formatPercent } from '../../utils/format.js';

export default function VehicleBanner({ vehicle }) {
  if (!vehicle) return null;

  return (
    <div className="bg-gradient-to-r from-adcb-teal to-[#1a2c34] text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <img src="/assets/logos/default-2.svg" alt="" className="h-5 opacity-60" />
              <h1 className="text-xl font-medium">{vehicle.displayName}</h1>
            </div>
            <p className="text-sm text-white/60">
              {vehicle.model} &middot; {vehicle.vin} &middot; v{vehicle.software}
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Stat label="Odometer" value={formatKm(vehicle.odometer?.km)} />
            <Stat label="Battery" value={formatPercent(vehicle.battery?.level)} />
            <Stat label="Range" value={formatKm(vehicle.battery?.range_km)} />
            <Stat label="State" value={vehicle.battery?.charging || 'Unknown'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-white/50 text-xs uppercase tracking-wider">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

import Card from '../shared/Card.jsx';
import KVRow from '../shared/KVRow.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';

export default function BatteryStatus({ battery }) {
  if (!battery) return null;

  const levelColor = battery.level >= 60 ? '#16A34A' : battery.level >= 30 ? '#F26B43' : '#BE000E';

  return (
    <Card>
      <h3 className="section-title mb-4">Battery Status</h3>
      <div className="flex items-center gap-5 mb-5">
        {/* Battery icon */}
        <div className="relative w-24 h-12 border-2 rounded-lg" style={{ borderColor: levelColor }}>
          <div
            className="absolute right-[-7px] top-[28%] w-[5px] h-[44%] rounded-r-sm"
            style={{ backgroundColor: levelColor }}
          />
          <div className="absolute inset-[3px] rounded overflow-hidden">
            <div
              className="battery-fill h-full rounded-sm"
              style={{ width: `${battery.level}%`, backgroundColor: levelColor, opacity: 0.75 }}
            />
          </div>
        </div>
        <div>
          <span className="stat-value text-bank-gray-dark">
            <AnimatedNumber value={battery.level} suffix="%" />
          </span>
          <p className="text-xs text-bank-gray-mid mt-0.5">{battery.range_km} km range</p>
        </div>
      </div>
      <KVRow label="Charging Status" value={battery.charging} />
      <KVRow label="Charger Type" value={battery.chargerType} />
      <KVRow label="Energy Added" value={`${battery.energyAdded_kWh} kWh`} />
      <KVRow label="Charge Limit" value={`${battery.chargeLimitPct}%`} />
      <KVRow label="Scheduled" value={battery.scheduledCharging} />
    </Card>
  );
}

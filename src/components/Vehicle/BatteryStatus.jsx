import Card from '../shared/Card.jsx';
import KVRow from '../shared/KVRow.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';

export default function BatteryStatus({ battery }) {
  if (!battery) return null;

  const levelColor = battery.level >= 60 ? '#16A34A' : battery.level >= 30 ? '#F26B43' : '#BE000E';

  return (
    <Card>
      <h3 className="text-sm font-medium text-bank-gray-dark mb-4">Battery Status</h3>
      <div className="flex items-center gap-4 mb-4">
        <div
          className="relative w-20 h-10 border-2 rounded-md border-bank-gray"
          style={{ borderColor: levelColor }}
        >
          <div
            className="absolute right-[-6px] top-[30%] w-[4px] h-[40%] rounded-r-sm"
            style={{ backgroundColor: levelColor }}
          />
          <div
            className="h-full rounded-sm transition-all duration-700"
            style={{ width: `${battery.level}%`, backgroundColor: levelColor, opacity: 0.7 }}
          />
        </div>
        <div>
          <span className="text-2xl font-medium text-bank-gray-dark">
            <AnimatedNumber value={battery.level} suffix="%" />
          </span>
        </div>
      </div>
      <KVRow label="Range" value={`${battery.range_km} km`} />
      <KVRow label="Charging Status" value={battery.charging} />
      <KVRow label="Charger Type" value={battery.chargerType} />
      <KVRow label="Energy Added" value={`${battery.energyAdded_kWh} kWh`} />
      <KVRow label="Charge Limit" value={`${battery.chargeLimitPct}%`} />
      <KVRow label="Scheduled" value={battery.scheduledCharging} />
    </Card>
  );
}

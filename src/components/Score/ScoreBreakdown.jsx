import ProgressBar from '../shared/ProgressBar.jsx';

const CATEGORY_LABELS = {
  batteryHealth: 'Battery Health',
  chargingBehavior: 'Charging Behavior',
  efficiency: 'Efficiency',
  evOwnership: 'EV Ownership',
  vehicleCondition: 'Vehicle Condition',
  renewableEnergy: 'Renewable Energy',
};

const CATEGORY_COLORS = {
  batteryHealth: '#0A6847',
  chargingBehavior: '#16A34A',
  efficiency: '#22C55E',
  evOwnership: '#16A34A',
  vehicleCondition: '#0A6847',
  renewableEnergy: '#A5A5A5',
};

export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const categories = Object.entries(breakdown);

  return (
    <div>
      <h3 className="text-sm font-medium text-bank-gray-dark mb-4">Score Breakdown</h3>
      {categories.map(([key, data], i) => (
        <ProgressBar
          key={key}
          label={CATEGORY_LABELS[key] || key}
          value={data.score}
          max={data.max}
          color={data.score === 0 ? '#A5A5A5' : CATEGORY_COLORS[key] || '#16A34A'}
          delay={i * 100}
          detail={data.detail}
        />
      ))}
    </div>
  );
}

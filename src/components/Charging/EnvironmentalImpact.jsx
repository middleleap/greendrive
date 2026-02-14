import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';

function Co2Icon() {
  return (
    <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="#0A6847" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="#0A6847" strokeWidth={1.5}>
      <path d="M12 22V8M7 12l5-10 5 10H7zM9 17l3-5 3 5H9z" />
    </svg>
  );
}

function FuelIcon() {
  return (
    <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="#0A6847" strokeWidth={1.5}>
      <rect x="4" y="4" width="10" height="16" rx="1" />
      <path d="M14 10h2a2 2 0 012 2v4a2 2 0 002 0v-8l-2-2" />
      <line x1="7" y1="4" x2="7" y2="8" />
    </svg>
  );
}

function SavingsIcon() {
  return (
    <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="#0A6847" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12h6M12 9v6" strokeLinecap="round" />
    </svg>
  );
}

const ICONS = { co2: Co2Icon, trees: TreeIcon, fuel: FuelIcon, savings: SavingsIcon };

export default function EnvironmentalImpact({ impact }) {
  if (!impact) return null;

  const stats = [
    { key: 'co2', label: 'CO\u2082 Saved', value: impact.co2Saved_kg, suffix: ' kg' },
    { key: 'trees', label: 'Trees Equivalent', value: impact.treesEquivalent, suffix: '' },
    { key: 'fuel', label: 'Gasoline Saved', value: impact.gasolineSaved_liters, suffix: ' L' },
    { key: 'savings', label: 'Cost Saved', value: impact.costSaved_aed, prefix: 'AED ', suffix: '' },
  ];

  return (
    <Card>
      <h3 className="text-sm font-medium text-bank-gray-dark mb-4">Environmental Impact</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map(s => {
          const Icon = ICONS[s.key];
          return (
            <div key={s.label} className="bg-green-pastel rounded-lg p-4 text-center">
              <Icon />
              <p className="text-xl font-medium text-green-deep mt-2">
                <AnimatedNumber value={s.value} prefix={s.prefix || ''} suffix={s.suffix} />
              </p>
              <p className="text-xs text-bank-gray-mid mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

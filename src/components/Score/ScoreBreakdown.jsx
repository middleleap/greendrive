import ProgressBar from '../shared/ProgressBar.jsx';

const CATEGORIES = {
  batteryHealth: {
    label: 'Battery Health',
    color: 'var(--color-green-deep)',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    guidance: 'Compares your estimated full-charge range to the EPA rated range for your model. Keep your battery between 20-80% for optimal health. Score range: 0-20 pts.',
  },
  chargingBehavior: {
    label: 'Charging Behavior',
    color: 'var(--color-green-main)',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    guidance: 'Home/Wall Connector charging scores highest (22 pts). Supercharger usage scores lowest (10 pts). Increase home charging to improve this score. Score range: 0-25 pts.',
  },
  efficiency: {
    label: 'Efficiency',
    color: 'var(--color-green-light)',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    guidance: 'Based on odometer reading. The sweet spot is 15,000-20,000 km (20 pts). Under 5,000 km scores 10 pts (low EV commitment). Over 30,000 km scores 8 pts (wear). Score range: 0-20 pts.',
  },
  evOwnership: {
    label: 'EV Ownership',
    color: 'var(--color-green-main)',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    guidance: 'Full battery electric vehicles (BEV) receive maximum points. All Tesla models qualify for 15/15 pts.',
  },
  vehicleCondition: {
    label: 'Vehicle Condition',
    color: 'var(--color-green-deep)',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    guidance: 'Based on software version year. 2026+ scores 10 pts, 2025 scores 8 pts, 2024 scores 6 pts, earlier scores 4 pts. Keep your vehicle software up to date.',
  },
  renewableEnergy: {
    label: 'Renewable Energy',
    color: 'var(--color-bank-gray)',
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    guidance: 'Requires DEWA energy data and Open Finance transaction consent. Connect these data sources to unlock up to 10 additional points.',
  },
};

export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const categories = Object.entries(breakdown);

  return (
    <div>
      <h3 className="section-title mb-5">Score Breakdown</h3>
      <div className="space-y-0.5">
        {categories.map(([key, data], i) => {
          const cat = CATEGORIES[key] || { label: key, color: 'var(--color-green-main)', icon: '' };
          return (
            <ProgressBar
              key={key}
              label={cat.label}
              value={data.score}
              max={data.max}
              color={data.score === 0 ? 'var(--color-bank-gray)' : cat.color}
              delay={i * 100}
              detail={data.detail}
              icon={cat.icon}
              badge={key === 'renewableEnergy' ? 'Coming Soon' : undefined}
              guidance={cat.guidance}
            />
          );
        })}
      </div>
    </div>
  );
}

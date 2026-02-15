import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';

const STATS = [
  {
    key: 'co2',
    label: 'CO\u2082 Saved',
    field: 'co2Saved_kg',
    suffix: ' kg',
    gradient: 'from-green-deep to-green-main',
    iconPath:
      'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
  },
  {
    key: 'trees',
    label: 'Trees Equivalent',
    field: 'treesEquivalent',
    suffix: '',
    gradient: 'from-green-main to-green-light',
    iconPath:
      'M12 21V11m0 0l-3 3m3-3l3 3M6.4 18H5a2 2 0 01-2-2v0a2 2 0 012-2h.5A6.5 6.5 0 0112 7.5 6.5 6.5 0 0118.5 14h.5a2 2 0 012 2v0a2 2 0 01-2 2h-1.4',
  },
  {
    key: 'fuel',
    label: 'Gasoline Saved',
    field: 'gasolineSaved_liters',
    suffix: ' L',
    gradient: 'from-green-deep to-[#0f8a5f]',
    iconPath:
      'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    key: 'savings',
    label: 'Cost Saved',
    field: 'costSaved_aed',
    prefix: 'AED ',
    suffix: '',
    gradient: 'from-green-main to-green-light',
    iconPath:
      'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

export default function EnvironmentalImpact({ impact }) {
  if (!impact) return null;

  return (
    <Card>
      <h3 className="section-title mb-1">Environmental Impact</h3>
      <p className="text-xs text-bank-gray-mid mb-4">
        Your green driving behaviour contributes to a better GreenDrive Score and lower loan rates.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((s) => (
          <div
            key={s.key}
            className={`impact-card bg-gradient-to-br ${s.gradient} relative overflow-hidden`}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute right-[-10px] top-[-10px] w-16 h-16 border border-white/20 rounded-full" />
              <div className="absolute right-[6px] top-[6px] w-8 h-8 border border-white/10 rounded-full" />
            </div>

            <div className="relative">
              <svg
                className="w-7 h-7 mx-auto text-white/70 mb-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={s.iconPath} />
              </svg>
              <p className="text-xl font-semibold text-white mt-1">
                <AnimatedNumber value={impact[s.field]} prefix={s.prefix || ''} suffix={s.suffix} />
              </p>
              <p className="text-[11px] text-white/60 mt-1 tracking-wide">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

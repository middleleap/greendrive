import Card from '../shared/Card.jsx';

const PATTERN_COLORS = {
  home: 'var(--color-green-deep)',
  supercharger: 'var(--color-bank-red)',
  publicL2: 'var(--color-bank-blue)',
  other: 'var(--color-bank-gray)',
};

const PATTERN_LABELS = {
  home: 'Home / Wall Connector',
  supercharger: 'Supercharger',
  publicL2: 'Public L2',
  other: 'Other',
};

export default function ChargingPattern({ patterns, sessions, totalSessions }) {
  if (!patterns) return null;

  return (
    <Card>
      <h3 className="section-title mb-4">Charging Pattern</h3>

      {/* Pattern bar */}
      <div className="flex h-5 rounded-full overflow-hidden mb-4">
        {Object.entries(patterns).map(([key, pct]) => (
          <div
            key={key}
            className="transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: PATTERN_COLORS[key] || 'var(--color-bank-gray)',
            }}
            title={`${PATTERN_LABELS[key]}: ${pct}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {Object.entries(patterns).map(([key, pct]) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: PATTERN_COLORS[key] }}
            />
            <span className="text-bank-gray-mid truncate">{PATTERN_LABELS[key]}</span>
            <span className="font-medium text-bank-gray-dark ml-auto tabular-nums">{pct}%</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-bank-gray-mid">{totalSessions} total sessions</p>

      {/* Recent sessions */}
      {sessions && sessions.length > 0 && (
        <div className="mt-5">
          <h4 className="text-[10px] font-medium text-bank-gray-mid uppercase tracking-widest mb-3">
            Recent Sessions
          </h4>
          <div className="space-y-0.5">
            {sessions.slice(0, 5).map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm py-2.5 border-b border-bank-gray-alt/60 last:border-0"
              >
                <div>
                  <span className="text-bank-gray-dark font-medium">{s.location}</span>
                  <span className="text-xs text-bank-gray-mid ml-2">{s.date}</span>
                </div>
                <span className="text-bank-gray-dark font-medium tabular-nums">
                  {s.energy_kWh} kWh
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

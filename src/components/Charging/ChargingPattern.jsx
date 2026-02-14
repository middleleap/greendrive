import Card from '../shared/Card.jsx';

const PATTERN_COLORS = {
  home: '#0A6847',
  supercharger: '#BE000E',
  publicL2: '#00B0F0',
  other: '#A5A5A5',
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
      <h3 className="text-sm font-medium text-adcb-gray-dark mb-4">Charging Pattern</h3>

      {/* Pattern bars */}
      <div className="flex h-4 rounded-full overflow-hidden mb-4">
        {Object.entries(patterns).map(([key, pct]) => (
          <div
            key={key}
            style={{ width: `${pct}%`, backgroundColor: PATTERN_COLORS[key] || '#A5A5A5' }}
            title={`${PATTERN_LABELS[key]}: ${pct}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(patterns).map(([key, pct]) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: PATTERN_COLORS[key] }} />
            <span className="text-adcb-gray-mid">{PATTERN_LABELS[key]}</span>
            <span className="font-medium text-adcb-gray-dark ml-auto">{pct}%</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-adcb-gray-mid">{totalSessions} total sessions</p>

      {/* Recent sessions */}
      {sessions && sessions.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-adcb-gray-mid uppercase tracking-wider mb-2">Recent Sessions</h4>
          <div className="space-y-2">
            {sessions.slice(0, 5).map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-adcb-gray-alt last:border-0">
                <div>
                  <span className="text-adcb-gray-dark">{s.location}</span>
                  <span className="text-xs text-adcb-gray-mid ml-2">{s.date}</span>
                </div>
                <span className="text-adcb-gray-dark font-medium">{s.energy_kWh} kWh</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

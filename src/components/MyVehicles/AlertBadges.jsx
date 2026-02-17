export default function AlertBadges({ fleet, onAlertClick }) {
  const allAlerts = fleet.flatMap((v) =>
    (v.alerts || []).map((a) => ({
      ...a,
      vehicleId: v.id,
      vehicleName: `${v.year} ${v.make} ${v.model}`,
    })),
  );

  if (allAlerts.length === 0) return null;

  const iconPaths = {
    rate: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    renewal: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    score: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    connect:
      'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  };

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none py-2 px-1">
      {allAlerts.map((alert, i) => (
        <button
          key={i}
          onClick={() => onAlertClick?.(alert)}
          className="mv-alert-badge flex-shrink-0"
          style={{ '--badge-color': alert.color }}
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke={alert.color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={iconPaths[alert.type] || iconPaths.score} />
          </svg>
          <span
            className="text-[10px] font-medium whitespace-nowrap"
            style={{ color: alert.color }}
          >
            {alert.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function HealthTab({ vehicle }) {
  const score = vehicle.greenDriveScore;
  const oem = vehicle.oem;

  if (!vehicle.connected || !score) {
    return (
      <div className="mv-section-card text-center py-8">
        <svg
          className="w-8 h-8 text-bank-gray-mid mx-auto mb-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <p className="text-sm font-medium text-bank-gray-dark mb-1">Connect to View Health Data</p>
        <p className="text-[10px] text-bank-gray-mid mb-3">
          Link your {vehicle.make} account to see GreenDrive Score and battery health.
        </p>
        <button className="px-4 py-2 rounded-lg bg-bank-maroon text-white text-[10px] font-medium hover:bg-bank-maroon-dark transition-colors">
          Connect {vehicle.make}
        </button>
      </div>
    );
  }

  const categories = [
    { key: 'chargingBehavior', label: 'Charging', color: '#16A34A' },
    { key: 'batteryHealth', label: 'Battery', color: '#0A6847' },
    { key: 'efficiency', label: 'Efficiency', color: '#22C55E' },
    { key: 'evOwnership', label: 'Ownership', color: '#16A34A' },
    { key: 'vehicleCondition', label: 'Condition', color: '#F26B43' },
    { key: 'renewableEnergy', label: 'Climate Risk', color: '#A5A5A5' },
  ];

  return (
    <div className="space-y-4">
      {/* GreenDrive Score */}
      <div className="mv-section-card flex items-center gap-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-20 h-20">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#E4E4E4" strokeWidth="5" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={score.tierColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${(score.totalScore / 100) * 213.6} 213.6`}
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold text-bank-gray-dark">{score.totalScore}</span>
            <span className="text-[7px] uppercase tracking-wider text-bank-gray-mid">Score</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: score.tierColor }}>
            {score.tier}
          </p>
          <p className="text-[10px] text-bank-gray-mid">
            {score.rateReduction > 0
              ? `${score.rateReduction.toFixed(2)}% rate reduction`
              : 'No rate reduction yet'}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mv-section-card">
        <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
          Score Breakdown
        </h4>
        <div className="space-y-2.5">
          {categories.map((cat) => {
            const data = score.breakdown[cat.key];
            if (!data) return null;
            const pct = (data.score / data.max) * 100;
            return (
              <div key={cat.key}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-bank-gray-mid">{cat.label}</span>
                  <span className="font-medium text-bank-gray-dark">
                    {data.score}/{data.max}
                  </span>
                </div>
                <div className="h-1.5 bg-bank-gray-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Battery Status */}
      {oem && (
        <div className="mv-section-card">
          <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
            Battery Status
          </h4>
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-bank-gray-mid mb-1">
              <span>Charge Level</span>
              <span className="font-medium text-bank-gray-dark">{oem.batteryLevel}%</span>
            </div>
            <div className="h-3 bg-bank-gray-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${oem.batteryLevel}%`,
                  backgroundColor:
                    oem.batteryLevel > 50
                      ? '#16A34A'
                      : oem.batteryLevel > 20
                        ? '#F26B43'
                        : '#BE000E',
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-bank-gray-bg">
              <p className="text-sm font-semibold text-bank-gray-dark">{oem.batterySoH}%</p>
              <p className="text-[8px] text-bank-gray-mid uppercase tracking-wider">SoH</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-bank-gray-bg">
              <p className="text-sm font-semibold text-bank-gray-dark">{oem.rangeKm}</p>
              <p className="text-[8px] text-bank-gray-mid uppercase tracking-wider">Range km</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-bank-gray-bg">
              <p className="text-sm font-semibold text-green-deep">Normal</p>
              <p className="text-[8px] text-bank-gray-mid uppercase tracking-wider">Cell Status</p>
            </div>
          </div>
        </div>
      )}

      {/* Data attribution */}
      <p className="text-[9px] text-bank-gray-mid text-center italic">
        Live data from Tesla Fleet API · Updated 2 min ago
      </p>
    </div>
  );
}

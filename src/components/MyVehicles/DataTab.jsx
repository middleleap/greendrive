export default function DataTab({ vehicle, dashboard }) {
  const veh = dashboard?.vehicle;
  const score = dashboard?.score || vehicle.greenDriveScore;
  const charging = dashboard?.charging;
  const oem = vehicle.oem;

  if (!veh && !oem && !score) {
    return (
      <div className="mv-section-card text-center py-8">
        <div className="spinner mx-auto mb-3" />
        <p className="text-sm font-medium text-bank-gray-dark">Loading vehicle data...</p>
      </div>
    );
  }

  const battery = veh?.battery;
  const odometer = veh?.odometer;
  const climate = veh?.climate;
  const state = veh?.state;

  return (
    <div className="space-y-4">
      {/* Vehicle Status */}
      {veh && (
        <div className="mv-section-card">
          <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
            Vehicle Status
          </h4>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            <InfoRow label="Model" value={veh.model || vehicle.model} />
            <InfoRow label="Software" value={veh.software || '—'} />
            {state && (
              <>
                <InfoRow label="Lock" value={state.locked ? 'Locked' : 'Unlocked'} />
                <InfoRow label="Sentry Mode" value={state.sentryMode ? 'Active' : 'Off'} />
                <InfoRow
                  label="Software Update"
                  value={state.softwareUpdate === 'available' ? 'Available' : 'Up to date'}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Battery & Charging */}
      {battery && (
        <div className="mv-section-card">
          <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
            Battery & Charging
          </h4>
          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-bank-gray-mid mb-1">
              <span>Charge Level</span>
              <span className="font-medium text-bank-gray-dark">{battery.level}%</span>
            </div>
            <div className="h-3 bg-bank-gray-bg rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${battery.level}%`,
                  backgroundColor:
                    battery.level > 50 ? '#16A34A' : battery.level > 20 ? '#F26B43' : '#BE000E',
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            <InfoRow label="Range" value={`${battery.range_km} km`} />
            <InfoRow label="Charging" value={battery.charging || '—'} />
            <InfoRow label="Charger Type" value={battery.chargerType || '—'} />
            <InfoRow label="Energy Added" value={`${battery.energyAdded_kWh} kWh`} />
            <InfoRow label="Charge Limit" value={`${battery.chargeLimitPct}%`} />
            <InfoRow
              label="Scheduled"
              value={battery.scheduledCharging === 'On' ? 'On' : 'Off'}
            />
          </div>
        </div>
      )}

      {/* Odometer & Climate */}
      {(odometer || climate) && (
        <div className="mv-section-card">
          <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
            Driving & Climate
          </h4>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
            {odometer && (
              <>
                <InfoRow label="Odometer" value={`${odometer.km.toLocaleString()} km`} />
                <InfoRow label="Miles" value={`${odometer.miles.toLocaleString()} mi`} />
              </>
            )}
            {climate && (
              <>
                <InfoRow label="Inside Temp" value={`${climate.insideTemp_C}°C`} />
                <InfoRow label="Outside Temp" value={`${climate.outsideTemp_C}°C`} />
                <InfoRow label="Climate" value={climate.isClimateOn ? 'On' : 'Off'} />
              </>
            )}
          </div>
        </div>
      )}

      {/* GreenDrive Score */}
      {score && (
        <div className="mv-section-card">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 64 64" className="w-16 h-16">
                <circle cx="32" cy="32" r="27" fill="none" stroke="#E4E4E4" strokeWidth="4" />
                <circle
                  cx="32"
                  cy="32"
                  r="27"
                  fill="none"
                  stroke={score.tierColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(score.totalScore / 100) * 169.6} 169.6`}
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-semibold text-bank-gray-dark">
                  {score.totalScore}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: score.tierColor }}>
                {score.tier}
              </p>
              <p className="text-[10px] text-bank-gray-mid">
                {score.rateReduction > 0
                  ? `${score.rateReduction.toFixed(2)}% rate reduction`
                  : 'No rate reduction yet'}
              </p>
            </div>
          </div>
          {score.breakdown && (
            <div className="space-y-2">
              {Object.entries(score.breakdown).map(([key, data]) => {
                if (!data) return null;
                const pct = (data.score / data.max) * 100;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-bank-gray-mid">{formatCategoryLabel(key)}</span>
                      <span className="font-medium text-bank-gray-dark">
                        {data.score}/{data.max}
                      </span>
                    </div>
                    <div className="h-1.5 bg-bank-gray-bg rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: score.tierColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Charging Sessions */}
      {charging?.sessions?.length > 0 && (
        <div className="mv-section-card">
          <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
            Recent Charging Sessions
          </h4>
          <div className="space-y-2">
            {charging.sessions.slice(0, 5).map((session, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-bank-gray-bg last:border-0"
              >
                <div>
                  <p className="text-xs font-medium text-bank-gray-dark">{session.location}</p>
                  <p className="text-[9px] text-bank-gray-mid">
                    {session.date} · {session.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-bank-gray-dark">
                    {session.energy_kWh} kWh
                  </p>
                  <p className="text-[9px] text-bank-gray-mid">{session.duration_min} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Environmental Impact */}
      {charging?.environmentalImpact && (
        <div className="mv-section-card">
          <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
            Environmental Impact
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <ImpactStat
              value={`${charging.environmentalImpact.co2Saved_kg.toLocaleString()}`}
              unit="kg CO2 saved"
            />
            <ImpactStat
              value={`${charging.environmentalImpact.treesEquivalent}`}
              unit="trees equiv."
            />
            <ImpactStat
              value={`${charging.environmentalImpact.gasolineSaved_liters.toLocaleString()}`}
              unit="litres saved"
            />
            <ImpactStat
              value={`${charging.environmentalImpact.costSaved_aed.toLocaleString()}`}
              unit="AED saved"
            />
          </div>
        </div>
      )}

      {/* Data attribution */}
      <p className="text-[9px] text-bank-gray-mid text-center italic">
        {dashboard?.metadata?.dataSource === 'live'
          ? 'Live data from Tesla Fleet API'
          : 'Simulated data for demonstration'}
      </p>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[9px] text-bank-gray-mid">{label}</p>
      <p className="text-xs font-medium text-bank-gray-dark">{value}</p>
    </div>
  );
}

function ImpactStat({ value, unit }) {
  return (
    <div className="text-center p-2 rounded-lg bg-green-pastel">
      <p className="text-sm font-semibold text-green-deep">{value}</p>
      <p className="text-[8px] text-green-deep/70 uppercase tracking-wider">{unit}</p>
    </div>
  );
}

function formatCategoryLabel(key) {
  const labels = {
    batteryHealth: 'Battery Health',
    chargingBehavior: 'Charging',
    efficiency: 'Efficiency',
    evOwnership: 'Ownership',
    vehicleCondition: 'Condition',
    renewableEnergy: 'Renewable Energy',
  };
  return labels[key] || key;
}

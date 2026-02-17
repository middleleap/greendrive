export default function VehicleCard({ vehicle, onClick, onConnectTesla }) {
  const score = vehicle.greenDriveScore;
  const loan = vehicle.loan;
  const insurance = vehicle.insurance;
  const oem = vehicle.oem;

  return (
    <button className="mv-vehicle-card w-full text-left" onClick={() => onClick?.(vehicle)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-bank-gray-dark">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
          <p className="text-[10px] text-bank-gray-mid">
            {vehicle.trim} · {vehicle.plateSource} {vehicle.plateCode} {vehicle.plateNumber}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-medium ${
              vehicle.engineType === 'Electric' || vehicle.engineType === 'Hybrid'
                ? 'bg-green-pastel text-green-deep'
                : 'bg-bank-gray-bg text-bank-gray-mid'
            }`}>
              {vehicle.engineType}
            </span>
            {vehicle.batteryCapacity && (
              <span className="text-[9px] text-bank-gray-mid">{vehicle.batteryCapacity}</span>
            )}
          </div>
        </div>
        {/* Score gauge or Connect button */}
        {score ? (
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 48 48" className="w-12 h-12">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#E4E4E4" strokeWidth="3" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke={score.tierColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(score.totalScore / 100) * 125.6} 125.6`}
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-bank-gray-dark">
                {score.totalScore}
              </span>
            </div>
            <span
              className="text-[8px] font-medium mt-0.5 px-1 rounded"
              style={{ color: score.tierColor }}
            >
              {score.tier}
            </span>
          </div>
        ) : vehicle.engineType === 'Electric' || vehicle.engineType === 'Hybrid' ? (
          <button
            className="mv-connect-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (vehicle.make === 'Tesla') onConnectTesla?.();
            }}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-[9px]">Connect</span>
          </button>
        ) : null}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 rounded-lg bg-bank-gray-bg">
          <p className="text-xs font-semibold text-bank-gray-dark">
            {loan?.currentRate ? `${loan.currentRate}%` : '—'}
          </p>
          <p className="text-[8px] text-bank-gray-mid uppercase tracking-wider">Loan Rate</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-bank-gray-bg">
          <p className="text-xs font-semibold text-bank-gray-dark">
            {insurance?.annualPremium ? `${(insurance.annualPremium / 1000).toFixed(1)}K` : '—'}
          </p>
          <p className="text-[8px] text-bank-gray-mid uppercase tracking-wider">Insurance</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-bank-gray-bg">
          <p className="text-xs font-semibold text-bank-gray-dark">
            {oem?.odometerKm ? `${(oem.odometerKm / 1000).toFixed(1)}K` : '—'}
          </p>
          <p className="text-[8px] text-bank-gray-mid uppercase tracking-wider">KM</p>
        </div>
      </div>

      {/* Battery bar (connected EVs only) */}
      {oem && vehicle.engineType === 'Electric' && (
        <div className="mb-2">
          <div className="flex justify-between text-[9px] text-bank-gray-mid mb-1">
            <span>Battery {oem.batteryLevel}%</span>
            <span>SoH {oem.batterySoH}%</span>
          </div>
          <div className="h-1.5 bg-bank-gray-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${oem.batteryLevel}%`,
                backgroundColor:
                  oem.batteryLevel > 50 ? '#16A34A' : oem.batteryLevel > 20 ? '#F26B43' : '#BE000E',
              }}
            />
          </div>
        </div>
      )}

      {/* Alert badges */}
      {vehicle.alerts?.length > 0 && (
        <div className="flex gap-1.5 mt-2">
          {vehicle.alerts.map((a, i) => (
            <span
              key={i}
              className="text-[8px] font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${a.color}15`,
                color: a.color,
              }}
            >
              {a.label}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

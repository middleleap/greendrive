export default function OverviewTab({ vehicle }) {
  const loan = vehicle.loan;
  const insurance = vehicle.insurance;
  const oem = vehicle.oem;

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        {loan?.newRate && (
          <button className="mv-action-btn mv-action-btn-red">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-medium">Refinance</span>
          </button>
        )}
        <button className="mv-action-btn mv-action-btn-blue">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[10px] font-medium">Compare Insurance</span>
        </button>
        {vehicle.connected ? (
          <button className="mv-action-btn mv-action-btn-green">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span className="text-[10px] font-medium">GreenDrive Score</span>
          </button>
        ) : (
          <button className="mv-action-btn mv-action-btn-maroon">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-[10px] font-medium">Connect {vehicle.make}</span>
          </button>
        )}
      </div>

      {/* Vehicle Identity Card (v2.1 §5.2.2–5.2.3 fields) */}
      <div className="mv-section-card">
        <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
          Vehicle Identity
        </h4>
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
          <InfoRow label="VIN" value={`${vehicle.vin.substring(0, 11)}${'*'.repeat(6)}`} />
          <InfoRow label="Engine Type" value={vehicle.engineType} />
          <InfoRow label="Body Type" value={vehicle.bodyType} />
          <InfoRow label="Trim" value={vehicle.trim} />
          {vehicle.batteryCapacity && <InfoRow label="Battery" value={vehicle.batteryCapacity} />}
          <InfoRow label="Spec" value={vehicle.carSpec} />
          <InfoRow label="Usage" value={vehicle.carUsage} />
          <InfoRow label="Colour" value={vehicle.color} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2">
        {/* Loan Balance */}
        <div className="mv-summary-card">
          <p className="text-[9px] uppercase tracking-wider text-bank-gray-mid mb-1">
            Loan Balance
          </p>
          <p className="text-base font-semibold text-bank-gray-dark">
            {loan ? `${(loan.outstandingBalance / 1000).toFixed(0)}K` : '—'}
          </p>
          {loan && (
            <p className="text-[9px] text-bank-gray-mid mt-0.5">
              {loan.currentRate}% · {loan.remainingMonths}mo
            </p>
          )}
        </div>
        {/* Insurance */}
        <div className="mv-summary-card">
          <p className="text-[9px] uppercase tracking-wider text-bank-gray-mid mb-1">Insurance</p>
          <p className="text-base font-semibold text-bank-gray-dark">
            {insurance ? `${(insurance.annualPremium / 1000).toFixed(1)}K` : '—'}
          </p>
          {insurance && (
            <p className="text-[9px] text-bank-gray-mid mt-0.5">
              Renewal in {insurance.daysToRenewal}d
            </p>
          )}
        </div>
        {/* Battery (connected only) */}
        {oem && (
          <div className="mv-summary-card">
            <p className="text-[9px] uppercase tracking-wider text-bank-gray-mid mb-1">Battery</p>
            <p className="text-base font-semibold text-bank-gray-dark">SoH {oem.batterySoH}%</p>
            <p className="text-[9px] text-bank-gray-mid mt-0.5">{oem.rangeKm} km range</p>
          </div>
        )}
        {/* Efficiency (connected only) */}
        {oem && (
          <div className="mv-summary-card">
            <p className="text-[9px] uppercase tracking-wider text-bank-gray-mid mb-1">
              Efficiency
            </p>
            <p className="text-base font-semibold text-bank-gray-dark">
              {oem.efficiencyWhKm} Wh/km
            </p>
            <p className="text-[9px] text-bank-gray-mid mt-0.5">30-day average</p>
          </div>
        )}
      </div>
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

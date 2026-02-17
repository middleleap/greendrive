import { ADD_ON_LABELS } from '../../utils/my-vehicles-data.js';

export default function InsuranceTab({ vehicle }) {
  const insurance = vehicle.insurance;
  const consent = vehicle.consent;

  if (!insurance) {
    return (
      <div className="mv-section-card text-center py-8">
        <p className="text-sm text-bank-gray-mid">No motor insurance on record for this vehicle.</p>
      </div>
    );
  }

  const addOns = insurance.addOns || {};
  const activeCount = Object.values(addOns).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Motor Insurance Policy Card */}
      <div className="mv-section-card">
        <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
          Motor Insurance Policy
        </h4>
        <div className="space-y-2.5">
          <PolicyRow label="Policy ID" value={insurance.policyId} mono />
          <PolicyRow label="Provider" value={insurance.provider} />
          <PolicyRow label="Policy Type" value={insurance.policyType} />
          <PolicyRow label="Coverage" value={insurance.coverageType} highlight />
          <PolicyRow label="Registration" value={insurance.registrationType} />
          <PolicyRow
            label="Annual Premium"
            value={`AED ${insurance.annualPremium.toLocaleString()}`}
            highlight
          />
          <PolicyRow
            label="Policy Period"
            value={`${insurance.policyStartDate} → ${insurance.policyEndDate}`}
          />
          <PolicyRow
            label="Days to Renewal"
            value={`${insurance.daysToRenewal} days`}
            warn={insurance.daysToRenewal < 60}
          />
          <PolicyRow label="Claims History" value={insurance.claimsHistory} />
        </div>
      </div>

      {/* Cover Add-Ons (v2.1 §5.2.1 fields 1.08.01–1.08.09) */}
      <div className="mv-section-card">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid">
            Cover Add-Ons
          </h4>
          <span className="text-[10px] font-medium text-green-deep">{activeCount}/9 active</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(ADD_ON_LABELS).map(([key, label]) => {
            const active = addOns[key];
            return (
              <span
                key={key}
                className={`mv-addon-pill ${active ? 'mv-addon-active' : 'mv-addon-inactive'}`}
              >
                {active ? (
                  <svg
                    className="w-2.5 h-2.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    className="w-2.5 h-2.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {label}
              </span>
            );
          })}
        </div>

        {/* Flood Cover Indicator */}
        <div
          className={`mt-3 p-2.5 rounded-lg ${insurance.floodCover ? 'bg-green-pastel' : 'bg-bank-pink'}`}
        >
          <div className="flex items-center gap-2">
            <svg
              className={`w-3.5 h-3.5 ${insurance.floodCover ? 'text-green-deep' : 'text-bank-red'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {insurance.floodCover ? (
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              ) : (
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              )}
            </svg>
            <div>
              <p
                className={`text-[10px] font-medium ${insurance.floodCover ? 'text-green-deep' : 'text-bank-red'}`}
              >
                {insurance.floodCover
                  ? 'Flood & Natural Disaster Cover Included'
                  : 'Flood Cover Not Included'}
              </p>
              {!insurance.floodCover && (
                <p className="text-[9px] text-bank-gray-mid mt-0.5">
                  EV battery replacement costs AED 40,000–80,000. Consider adding flood cover.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Data Sharing Consent Card */}
      <div className="mv-section-card">
        <h4 className="text-[10px] uppercase tracking-widest text-bank-gray-mid mb-3">
          Data Sharing Consent
        </h4>
        {consent?.status === 'Authorised' ? (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-main" />
              <span className="text-[10px] font-medium text-green-deep">Authorised</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {consent.permissions.map((perm) => (
                <span key={perm} className="mv-permission-pill">
                  {perm}
                </span>
              ))}
            </div>
            <p className="text-[9px] text-bank-gray-mid">
              Consent expires {consent.expiryDate} ·{' '}
              <a href="#" className="text-bank-red">
                Manage Consent
              </a>
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-bank-pink">
            <p className="text-[10px] text-bank-maroon font-medium mb-1">Consent Required</p>
            <p className="text-[9px] text-bank-gray-mid mb-2">
              Authorise ADCB to retrieve your insurance policy data from your insurer via Al Tareq.
            </p>
            <button className="w-full py-2 rounded-lg bg-bank-maroon text-white text-[10px] font-medium hover:bg-bank-maroon-dark transition-colors">
              Authorise via Al Tareq
            </button>
          </div>
        )}
      </div>

      {/* Quote Initiation CTA */}
      <button className="w-full py-3 rounded-lg bg-bank-blue text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
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
        Get Quotes via Al Tareq
      </button>

      {/* Attribution Footer */}
      <p className="text-[9px] text-bank-gray-mid text-center italic">
        Policy data via Al Tareq Insurance Data Sharing API · v2.1
      </p>
    </div>
  );
}

function PolicyRow({ label, value, mono = false, highlight = false, warn = false }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] text-bank-gray-mid">{label}</span>
      <span
        className={`text-xs font-medium ${
          warn
            ? 'text-bank-orange'
            : highlight
              ? 'text-bank-gray-dark font-semibold'
              : 'text-bank-gray-dark'
        } ${mono ? 'font-mono text-[10px]' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}

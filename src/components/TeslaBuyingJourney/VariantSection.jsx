import { MODEL_3_VARIANTS, calculateMonthly } from '../../utils/tesla-configurator-data.js';

function formatPrice(amount) {
  return `AED ${amount.toLocaleString()}`;
}

export default function VariantSection({
  config,
  paymentMode,
  greenRate,
  tierName,
  onConfigChange,
  onEditTerms,
}) {
  const selected = MODEL_3_VARIANTS.find((v) => v.id === config.variant);

  function getDisplayPrice(variant) {
    switch (paymentMode) {
      case 'cash':
        return formatPrice(variant.price);
      case 'lease':
        return `${formatPrice(variant.monthlyPayments.lease)} /mo`;
      case 'loan':
        return `${formatPrice(variant.monthlyPayments.loan)} /mo`;
      case 'islamic':
        return `${formatPrice(variant.monthlyPayments.islamic)} /mo`;
      case 'green-loan': {
        const downPayment = variant.price * 0.1;
        const principal = variant.price - downPayment;
        const emi = Math.round(calculateMonthly(principal, greenRate, 5));
        return `${formatPrice(emi)} /mo`;
      }
      default:
        return formatPrice(variant.price);
    }
  }

  function getTermsText(variant) {
    switch (paymentMode) {
      case 'cash':
        return `Price excludes Tesla trade-in uplift of AED 15,000 and 5 year gas savings of AED 12,500`;
      case 'lease':
        return `*${variant.leaseTerms}`;
      case 'loan':
        return `*${variant.loanTerms}`;
      case 'islamic':
        return `*Murabaha finance, 0% profit rate, Dubai Islamic Bank PJSC`;
      case 'green-loan':
        return `*10% down, 60 months, ${greenRate.toFixed(2)}% Green Rate`;
      default:
        return '';
    }
  }

  return (
    <div className="tc-section">
      {/* Specs row for selected variant */}
      {selected && (
        <div className="tc-specs-row">
          <div className="tc-spec-item">
            <div className="tc-spec-value">
              {selected.range}
              <span className="text-sm font-normal">km</span>
            </div>
            <div className="tc-spec-label">Range (WLTP)</div>
          </div>
          <div className="tc-spec-item">
            <div className="tc-spec-value">
              {selected.topSpeed}
              <span className="text-sm font-normal">km/h</span>
            </div>
            <div className="tc-spec-label">Top Speed</div>
          </div>
          <div className="tc-spec-item">
            <div className="tc-spec-value">
              {selected.acceleration}
              <span className="text-sm font-normal">s</span>
            </div>
            <div className="tc-spec-label">0-100 km/h</div>
          </div>
        </div>
      )}

      {/* Variant cards */}
      <div className="space-y-3">
        {MODEL_3_VARIANTS.map((variant) => {
          const isSelected = config.variant === variant.id;
          const isGreen = paymentMode === 'green-loan';
          return (
            <button
              key={variant.id}
              onClick={() =>
                onConfigChange({
                  variant: variant.id,
                  wheels: variant.defaultWheel,
                  exteriorColor:
                    config.exteriorColor &&
                    !['marine-blue', 'ultra-red', 'quicksilver'].includes(config.exteriorColor)
                      ? config.exteriorColor
                      : 'pearl-white',
                })
              }
              className={`tc-variant-card ${isSelected ? (isGreen ? 'tc-variant-card-green' : 'tc-variant-card-selected') : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-bank-gray-mid">{variant.drivetrainLabel}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {variant.badge && (
                      <span className="text-xs font-bold text-bank-gray-dark">{variant.badge}</span>
                    )}
                    <span className="text-sm text-bank-gray-dark">{variant.subtitle}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-bank-gray-dark">{getDisplayPrice(variant)}</p>
                  {isGreen && isSelected && tierName && (
                    <span className="tc-green-pill mt-1">{tierName}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Terms text */}
      {selected && (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-bank-gray-mid">{getTermsText(selected)}</p>
          <button className="tc-terms-link" onClick={onEditTerms}>
            Edit Financial Terms &amp; Savings
          </button>
        </div>
      )}
    </div>
  );
}

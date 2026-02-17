import { getAvailableWheels, MODEL_3_VARIANTS } from '../../utils/tesla-configurator-data.js';

export default function WheelSection({ config, onConfigChange }) {
  const wheels = getAvailableWheels(config.variant);
  const selected = wheels.find((w) => w.id === config.wheels);
  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  const effectiveRange = variant ? variant.range + (selected?.rangeImpact || 0) : null;

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">{selected?.name || 'Wheels'}</h2>
      <p className="tc-section-subtitle">
        {selected
          ? selected.price === 0
            ? 'Included'
            : `AED ${selected.price.toLocaleString()}`
          : 'Select wheels'}
      </p>
      <div className="flex gap-3 flex-wrap">
        {wheels.map((wheel) => (
          <button
            key={wheel.id}
            onClick={() => onConfigChange({ wheels: wheel.id })}
            className={`tc-swatch ${config.wheels === wheel.id ? 'tc-swatch-selected' : ''}`}
            style={{
              background: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 600,
              color: '#555',
            }}
            aria-label={wheel.name}
            title={`${wheel.name}${wheel.price > 0 ? ` — AED ${wheel.price.toLocaleString()}` : ''}`}
          >
            {wheel.name.match(/\d+/)?.[0]}&quot;
          </button>
        ))}
      </div>
      {effectiveRange && (
        <div className="mt-3">
          <span className="tc-range-badge">Certified Range (WLTP): {effectiveRange} km</span>
        </div>
      )}
    </div>
  );
}

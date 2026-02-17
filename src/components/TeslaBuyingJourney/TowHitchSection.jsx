import { TOW_HITCH } from '../../utils/tesla-configurator-data.js';

export default function TowHitchSection({ config, onConfigChange }) {
  if (!TOW_HITCH.available.includes(config.variant)) return null;
  const checked = !!config.towHitch;

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">Tow Hitch</h2>
      <p className="tc-section-subtitle">{TOW_HITCH.description}</p>
      <button
        onClick={() => onConfigChange({ towHitch: !checked })}
        className={`tc-checkbox-card ${checked ? 'tc-checkbox-card-checked' : ''}`}
      >
        <div className={`tc-checkbox ${checked ? 'tc-checkbox-checked' : ''}`}>
          {checked && <span className="text-xs">✓</span>}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-bank-gray-dark">{TOW_HITCH.name}</p>
        </div>
        <p className="text-sm font-semibold text-bank-gray-dark">
          AED {TOW_HITCH.price.toLocaleString()}
        </p>
      </button>
    </div>
  );
}

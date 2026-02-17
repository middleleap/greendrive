import { CHARGING_ACCESSORIES } from '../../utils/tesla-configurator-data.js';

export default function ChargingSection({ config, onConfigChange }) {
  const selected = config.chargingAccessories || [];

  function toggle(id) {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    onConfigChange({ chargingAccessories: next });
  }

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">Charging</h2>
      <p className="tc-section-subtitle">Every Tesla includes access to the largest global Supercharging network</p>
      <div className="space-y-3">
        {CHARGING_ACCESSORIES.map(item => {
          const checked = selected.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`tc-checkbox-card ${checked ? 'tc-checkbox-card-checked' : ''}`}
            >
              <div className={`tc-checkbox ${checked ? 'tc-checkbox-checked' : ''}`}>
                {checked && <span className="text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-bank-gray-dark">{item.name}</p>
                <p className="text-xs text-bank-gray-mid">{item.description}</p>
              </div>
              <p className="text-sm font-semibold text-bank-gray-dark">AED {item.price.toLocaleString()}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

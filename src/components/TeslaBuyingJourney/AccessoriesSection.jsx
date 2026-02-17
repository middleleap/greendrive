import { ACCESSORIES } from '../../utils/tesla-configurator-data.js';

export default function AccessoriesSection({ config, onConfigChange }) {
  const selected = config.accessories || [];

  function toggle(id) {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    onConfigChange({ accessories: next });
  }

  return (
    <div className="tc-section">
      <h2 className="tc-section-title">Accessories</h2>
      <div className="space-y-3 mt-3">
        {ACCESSORIES.map(item => {
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
              </div>
              <p className="text-sm font-semibold text-bank-gray-dark">AED {item.price.toLocaleString()}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

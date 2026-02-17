import { AUTOPILOT_OPTIONS } from '../../utils/tesla-configurator-data.js';

export default function AutopilotSection({ config, onConfigChange }) {
  return (
    <div className="tc-section">
      <h2 className="tc-section-title">Autopilot</h2>
      <div className="space-y-3 mt-3">
        {AUTOPILOT_OPTIONS.map(option => {
          const isSelected = config.autopilot === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onConfigChange({ autopilot: option.id })}
              className={`tc-variant-card ${isSelected ? 'tc-variant-card-selected' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-bank-gray-dark">{option.name}</p>
                <p className="text-sm font-semibold text-bank-gray-dark">
                  {option.price === 0 ? 'Included' : `AED ${option.price.toLocaleString()}`}
                </p>
              </div>
              <p className="text-xs text-bank-gray-mid">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

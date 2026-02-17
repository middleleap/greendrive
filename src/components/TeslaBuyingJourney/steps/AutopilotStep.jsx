import { AUTOPILOT_OPTIONS } from '../../../utils/tesla-configurator-data.js';
import OptionCard from '../shared/OptionCard.jsx';

export default function AutopilotStep({ config, onConfigChange }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-bank-gray-dark mb-1">Autopilot</h2>
      <p className="text-xs text-bank-gray-mid mb-6">Select your self-driving capability</p>

      <div className="space-y-4">
        {AUTOPILOT_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.id}
            selected={config.autopilot === opt.id}
            onClick={() => onConfigChange({ autopilot: opt.id })}
            className="w-full"
          >
            <div className="text-left w-full">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-bank-gray-dark">{opt.name}</p>
                <p className="text-sm font-semibold text-bank-gray-dark tabular-nums ml-4 flex-shrink-0">
                  {opt.price === 0 ? 'Included' : `+AED ${opt.price.toLocaleString()}`}
                </p>
              </div>
              <ul className="space-y-1">
                {opt.features.map((f) => (
                  <li key={f} className="text-xs text-bank-gray-mid flex items-center gap-2">
                    <svg
                      className="w-3 h-3 text-green-main flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

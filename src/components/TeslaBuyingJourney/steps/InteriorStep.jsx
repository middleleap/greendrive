import { INTERIOR_OPTIONS } from '../../../utils/tesla-configurator-data.js';
import OptionCard from '../shared/OptionCard.jsx';

export default function InteriorStep({ config, onConfigChange }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-bank-gray-dark mb-1">Interior</h2>
      <p className="text-xs text-bank-gray-mid mb-6">Choose your interior theme</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INTERIOR_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.id}
            selected={config.interior === opt.id}
            onClick={() => onConfigChange({ interior: opt.id })}
          >
            <div className="text-left">
              {/* Interior color preview */}
              <div className="h-20 rounded-xl mb-3 flex overflow-hidden">
                {opt.id === 'black-white' ? (
                  <>
                    <div className="flex-1 bg-[#1a1a1a]" />
                    <div className="flex-1 bg-[#f0f0f0]" />
                  </>
                ) : (
                  <div className="flex-1 bg-[#1a1a1a]" />
                )}
              </div>
              <p className="text-sm font-semibold text-bank-gray-dark">{opt.name}</p>
              <p className="text-xs text-bank-gray-mid mt-1">
                {opt.price === 0 ? 'Included' : `+AED ${opt.price.toLocaleString()}`}
              </p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

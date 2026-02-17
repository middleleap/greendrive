import { WHEEL_OPTIONS } from '../../../utils/tesla-configurator-data.js';
import OptionCard from '../shared/OptionCard.jsx';

export default function WheelsStep({ config, onConfigChange }) {
  const availableWheels = WHEEL_OPTIONS.filter((w) => w.available.includes(config.variant));

  return (
    <div>
      <h2 className="text-lg font-semibold text-bank-gray-dark mb-1">Wheels</h2>
      <p className="text-xs text-bank-gray-mid mb-6">Select your wheel style</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableWheels.map((wheel) => (
          <OptionCard
            key={wheel.id}
            selected={config.wheels === wheel.id}
            onClick={() => onConfigChange({ wheels: wheel.id })}
          >
            <div className="text-left">
              {/* Wheel visual */}
              <div className="w-16 h-16 rounded-full border-4 border-bank-gray-alt bg-bank-gray-bg mx-auto mb-3 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-bank-gray-alt" />
              </div>
              <p className="text-sm font-semibold text-bank-gray-dark text-center">{wheel.name}</p>
              <p className="text-xs text-bank-gray-mid text-center mt-1">
                {wheel.price === 0 ? 'Included' : `+AED ${wheel.price.toLocaleString()}`}
              </p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

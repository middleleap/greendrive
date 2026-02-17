import { MODEL_3_VARIANTS } from '../../../utils/tesla-configurator-data.js';
import OptionCard from '../shared/OptionCard.jsx';
import SpecBadge from '../shared/SpecBadge.jsx';

// SVG icon paths
const RANGE_ICON = 'M13 10V3L4 14h7v7l9-11h-7z'; // bolt
const SPEED_ICON = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'; // clock

export default function VariantStep({ config, onConfigChange }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-bank-gray-dark mb-1">Choose Your Model 3</h2>
      <p className="text-xs text-bank-gray-mid mb-6">Select the variant that fits your driving style</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODEL_3_VARIANTS.map((v) => (
          <OptionCard
            key={v.id}
            selected={config.variant === v.id}
            onClick={() => {
              const updates = { variant: v.id };
              // Auto-set default wheels based on variant
              if (v.id === 'performance') {
                updates.wheels = 'warp-20';
              } else if (!config.wheels || config.wheels === 'warp-20') {
                updates.wheels = 'photon-18';
              }
              onConfigChange(updates);
            }}
          >
            <div className="text-left">
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">{v.name}</p>
              <p className="text-base font-semibold text-bank-gray-dark mb-3">{v.subtitle}</p>
              <div className="flex flex-wrap gap-3 mb-4">
                <SpecBadge icon={RANGE_ICON} value={`${v.range} km`} />
                <SpecBadge icon={SPEED_ICON} value={`${v.acceleration}s`} label="0-100" />
                <SpecBadge value={v.drivetrain} />
              </div>
              <p className="text-lg font-semibold text-bank-gray-dark tabular-nums">
                AED {v.price.toLocaleString()}
              </p>
            </div>
          </OptionCard>
        ))}
      </div>
    </div>
  );
}

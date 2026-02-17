import { EXTERIOR_COLORS } from '../../../utils/tesla-configurator-data.js';

export default function ExteriorStep({ config, onConfigChange }) {
  const selectedColor = EXTERIOR_COLORS.find((c) => c.id === config.exteriorColor);

  return (
    <div>
      <h2 className="text-lg font-semibold text-bank-gray-dark mb-1">Exterior Color</h2>
      <p className="text-xs text-bank-gray-mid mb-6">Choose your paint finish</p>

      {/* Color preview area */}
      <div
        className="rounded-2xl bg-bank-gray-bg p-8 mb-6 flex items-center justify-center"
        style={{ minHeight: 180 }}
      >
        <div className="text-center">
          <div
            className="w-32 h-20 rounded-xl mx-auto mb-3 shadow-lg transition-colors duration-500"
            style={{ backgroundColor: selectedColor?.hex || '#e8e8e8' }}
          />
          <p className="text-sm font-medium text-bank-gray-dark">{selectedColor?.name}</p>
          <p className="text-xs text-bank-gray-mid mt-0.5">
            {selectedColor?.price === 0
              ? 'Included'
              : `+AED ${selectedColor?.price.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Color swatches */}
      <div className="flex justify-center gap-3 flex-wrap">
        {EXTERIOR_COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => onConfigChange({ exteriorColor: color.id })}
            className={`cfg-color-swatch ${config.exteriorColor === color.id ? 'cfg-color-swatch-selected' : ''}`}
            style={{ '--swatch-color': color.hex }}
            title={`${color.name}${color.price > 0 ? ` (+AED ${color.price.toLocaleString()})` : ''}`}
            aria-label={color.name}
            aria-pressed={config.exteriorColor === color.id}
          >
            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: color.hex }} />
          </button>
        ))}
      </div>
    </div>
  );
}

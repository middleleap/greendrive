import {
  MODEL_3_VARIANTS,
  EXTERIOR_COLORS,
  getTotalPrice,
} from '../../../utils/tesla-configurator-data.js';

export default function ConfigSummaryBar({ config }) {
  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  const color = EXTERIOR_COLORS.find((c) => c.id === config.exteriorColor);
  const totalPrice = getTotalPrice(config);

  if (!variant) return null;

  return (
    <div className="cfg-summary-bar">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {color && (
            <div
              className="w-4 h-4 rounded-full border border-bank-gray-alt"
              style={{ backgroundColor: color.hex }}
            />
          )}
          <div className="text-sm">
            <span className="font-medium text-bank-gray-dark">{variant.subtitle}</span>
            {color && <span className="text-bank-gray-mid ml-1.5 text-xs">· {color.name}</span>}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-bank-gray-dark tabular-nums">
            AED {totalPrice.toLocaleString()}
          </p>
          <p className="text-[10px] text-bank-gray-mid">Est. total</p>
        </div>
      </div>
    </div>
  );
}

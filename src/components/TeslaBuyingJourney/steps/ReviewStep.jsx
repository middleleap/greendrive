import {
  MODEL_3_VARIANTS,
  EXTERIOR_COLORS,
  WHEEL_OPTIONS,
  INTERIOR_OPTIONS,
  AUTOPILOT_OPTIONS,
  getTotalPrice,
} from '../../../utils/tesla-configurator-data.js';

export default function ReviewStep({ config }) {
  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  const color = EXTERIOR_COLORS.find((c) => c.id === config.exteriorColor);
  const wheels = WHEEL_OPTIONS.find((w) => w.id === config.wheels);
  const interior = INTERIOR_OPTIONS.find((i) => i.id === config.interior);
  const autopilot = AUTOPILOT_OPTIONS.find((a) => a.id === config.autopilot);
  const totalPrice = getTotalPrice(config);

  const lineItems = [
    {
      label: `Model 3 ${variant?.subtitle}`,
      price: variant?.price,
      detail: `${variant?.range} km range · ${variant?.acceleration}s 0-100`,
    },
    { label: color?.name, price: color?.price, detail: 'Exterior color' },
    { label: wheels?.name, price: wheels?.price, detail: 'Wheels' },
    { label: interior?.name, price: interior?.price, detail: 'Interior' },
    { label: autopilot?.name, price: autopilot?.price, detail: 'Self-driving' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-bank-gray-dark mb-1">Review Your Configuration</h2>
      <p className="text-xs text-bank-gray-mid mb-6">
        Confirm your choices before proceeding to financing
      </p>

      {/* Config overview card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-bank-gray-alt">
          {color && (
            <div
              className="w-12 h-12 rounded-xl shadow-sm flex-shrink-0"
              style={{ backgroundColor: color.hex }}
            />
          )}
          <div>
            <p className="text-base font-semibold text-bank-gray-dark">
              Tesla Model 3 {variant?.subtitle}
            </p>
            <p className="text-xs text-bank-gray-mid">
              {color?.name} · {wheels?.name} · {interior?.name}
            </p>
          </div>
        </div>

        {/* Line items */}
        <div className="space-y-3">
          {lineItems.map((item) => (
            <div key={item.label} className="flex items-start justify-between">
              <div>
                <p className="text-sm text-bank-gray-dark font-medium">{item.label}</p>
                <p className="text-[10px] text-bank-gray-mid">{item.detail}</p>
              </div>
              <p className="text-sm text-bank-gray-dark tabular-nums font-medium flex-shrink-0 ml-4">
                {item.price === 0 ? 'Included' : `AED ${item.price.toLocaleString()}`}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-5 pt-4 border-t border-bank-gray-alt flex items-baseline justify-between">
          <p className="text-sm font-semibold text-bank-gray-dark">Estimated Total</p>
          <p className="text-xl font-semibold text-bank-gray-dark tabular-nums">
            AED {totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-green-pastel border-l-3 border-green-deep rounded-lg p-4">
        <p className="text-sm font-medium text-green-deep mb-1">Ready for Financing?</p>
        <p className="text-xs text-green-deep/80">
          Continue to see how our Green Car Loan compares to Tesla Finance — with lower down
          payments, longer terms, and GreenDrive tier rate reductions.
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  getTotalPrice, getPurchasePrice, DESTINATION_FEE, calculateMonthly,
  MODEL_3_VARIANTS, EXTERIOR_COLORS, WHEEL_OPTIONS, AUTOPILOT_OPTIONS,
  CHARGING_ACCESSORIES, ACCESSORIES, TOW_HITCH,
} from '../../utils/tesla-configurator-data.js';

export default function OrderSummary({ config, paymentMode, greenRate, tierName, score, onApply, onClose }) {
  const [showDetails, setShowDetails] = useState(false);
  const variant = MODEL_3_VARIANTS.find(v => v.id === config.variant);
  const color = EXTERIOR_COLORS.find(c => c.id === config.exteriorColor);
  const wheels = WHEEL_OPTIONS.find(w => w.id === config.wheels);
  const autopilot = AUTOPILOT_OPTIONS.find(a => a.id === config.autopilot);
  const isGreen = paymentMode === 'green-loan';
  const totalPrice = getTotalPrice(config);
  const purchasePrice = getPurchasePrice(config);

  if (!variant) return null;

  const lineItems = [
    { label: `Model 3 ${variant.subtitle}`, amount: variant.price },
    color?.price > 0 && { label: `${color.name} Paint`, amount: color.price },
    wheels?.price > 0 && { label: wheels.name, amount: wheels.price },
    autopilot?.price > 0 && { label: autopilot.name, amount: autopilot.price },
    config.towHitch && { label: 'Tow Hitch', amount: TOW_HITCH.price },
    ...(config.chargingAccessories || []).map(id => {
      const item = CHARGING_ACCESSORIES.find(c => c.id === id);
      return item ? { label: item.name, amount: item.price } : null;
    }),
    ...(config.accessories || []).map(id => {
      const item = ACCESSORIES.find(a => a.id === id);
      return item ? { label: item.name, amount: item.price } : null;
    }),
  ].filter(Boolean);

  // Green loan calculations
  const greenDown = purchasePrice * 0.10;
  const greenPrincipal = purchasePrice - greenDown;
  const greenEmi = calculateMonthly(greenPrincipal, greenRate, 5);
  const greenTotalInterest = (greenEmi * 60) - greenPrincipal;

  // Tesla loan comparison
  const teslaDown = purchasePrice * 0.20;
  const teslaPrincipal = purchasePrice - teslaDown;
  const teslaEmi = calculateMonthly(teslaPrincipal, 0, 5); // 0% APR
  const teslaTotalCost = teslaDown + (teslaEmi * 60);

  const greenTotalCost = greenDown + (greenEmi * 60);

  return (
    <div className="tc-order-summary">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-bank-gray-dark">Your Model 3</h3>
            <p className="text-xs text-bank-gray-mid mt-1">Estimated Delivery: May 2026</p>
          </div>
          <button onClick={onClose} className="text-bank-gray-mid hover:text-bank-gray-dark text-xl">&times;</button>
        </div>

        {/* Pricing details toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="tc-terms-link mb-4 block"
        >
          {showDetails ? 'Hide' : 'Show'} Pricing Details
        </button>

        {showDetails && (
          <div className="space-y-2 mb-6 pb-4 border-b border-bank-gray-alt">
            {lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-bank-gray-mid">{item.label}</span>
                <span className="text-bank-gray-dark">
                  {item.amount === 0 ? 'Included' : `AED ${item.amount.toLocaleString()}`}
                </span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-bank-gray-alt">
              <span className="text-bank-gray-mid">Destination & doc fee</span>
              <span className="text-bank-gray-dark">AED {DESTINATION_FEE.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2">
              <span className="text-bank-gray-dark">Purchase Price</span>
              <span className="text-bank-gray-dark">AED {purchasePrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Green Loan comparison */}
        {isGreen ? (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border-2 border-green-deep bg-green-pale">
              <div className="flex items-center gap-2 mb-3">
                <span className="tc-green-pill">{tierName || 'Green Rate'}</span>
                <span className="text-sm font-semibold text-green-deep">{greenRate.toFixed(2)}%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-deep">AED {Math.round(greenEmi).toLocaleString()}</p>
                  <p className="text-xs text-bank-gray-mid">Monthly EMI</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-bank-gray-dark">AED {Math.round(greenDown).toLocaleString()}</p>
                  <p className="text-xs text-bank-gray-mid">Down (10%)</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-bank-gray-dark">5 years</p>
                  <p className="text-xs text-bank-gray-mid">Term</p>
                </div>
              </div>
            </div>

            {/* vs Tesla comparison */}
            <div className="p-4 rounded-xl bg-bank-gray-bg">
              <p className="text-xs font-semibold text-bank-gray-mid uppercase tracking-wider mb-3">vs Tesla Finance (0% APR)</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-bank-gray-mid">Tesla down payment (20%)</span>
                  <span className="text-bank-gray-dark">AED {Math.round(teslaDown).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bank-gray-mid">Your down payment (10%)</span>
                  <span className="text-green-deep font-semibold">AED {Math.round(greenDown).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-bank-gray-alt">
                  <span className="text-bank-gray-mid">Liquidity you keep</span>
                  <span className="text-green-deep font-bold">AED {Math.round(teslaDown - greenDown).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onApply}
              className="w-full tc-order-btn tc-order-btn-green py-3 text-base"
            >
              Apply for Green Car Loan
            </button>
            <p className="text-xs text-bank-gray text-center">Indicative figures only. Subject to credit approval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-bank-gray-mid">Due Today</span>
              <div className="text-right">
                <p className="font-semibold text-bank-gray-dark">AED 5,000</p>
                <p className="text-xs text-bank-gray">Non-refundable Order Fee</p>
              </div>
            </div>
            <button className="w-full tc-order-btn tc-order-btn-dark py-3 text-base border border-bank-gray-dark bg-transparent text-bank-gray-dark hover:bg-bank-gray-bg">
              Order with Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

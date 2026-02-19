import { useState } from 'react';
import {
  calculateMonthly,
  getPurchasePrice,
  MODEL_3_VARIANTS,
  PAYMENT_MODES,
} from '../../utils/tesla-configurator-data.js';
import { getImageUrl, IMAGE_VIEWS } from '../../utils/tesla-configurator-data.js';

export default function FinancingModal({
  config,
  paymentMode,
  greenRate,
  tierName,
  score,
  onPaymentModeChange,
  onClose,
}) {
  const purchasePrice = getPurchasePrice(config);
  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  const isGreen = paymentMode === 'green-loan';

  const [downPct, setDownPct] = useState(isGreen ? 10 : 20);
  const [termYears, setTermYears] = useState(5);

  const downPayment = purchasePrice * (downPct / 100);
  const principal = purchasePrice - downPayment;

  const rate = isGreen ? greenRate : 0; // Tesla offers 0% for loan mode
  const emi = calculateMonthly(principal, rate, termYears);
  const totalInterest = emi * termYears * 12 - principal;

  const imageUrl = getImageUrl({ ...config, _view: IMAGE_VIEWS.REAR });

  return (
    <div className="tc-modal-overlay">
      <div className="tc-modal-backdrop" onClick={onClose} />
      <div className="tc-modal">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — car image */}
          <div className="hidden lg:flex items-center justify-center bg-[#f4f4f4] rounded-l-xl p-8">
            <img
              src={imageUrl || '/assets/model3-fallback.svg'}
              alt="Model 3"
              className="max-w-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/model3-fallback.svg';
              }}
            />
          </div>

          {/* Right — financing options */}
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-bank-gray-dark">Financing Options</h2>
              <button
                onClick={onClose}
                className="text-bank-gray-mid hover:text-bank-gray-dark text-xl"
              >
                &times;
              </button>
            </div>

            {/* Payment mode selector */}
            <select
              value={paymentMode}
              onChange={(e) => onPaymentModeChange(e.target.value)}
              className={`tc-payment-select mb-6 ${isGreen ? 'tc-payment-select-green' : ''}`}
            >
              {PAYMENT_MODES.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.id === 'green-loan' ? '🟢 ' : ''}
                  {mode.label}
                </option>
              ))}
            </select>

            {/* EMI display */}
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-bank-gray-dark">
                AED {Math.round(emi).toLocaleString()}{' '}
                <span className="text-lg font-normal">/mo est.</span>
              </p>
              {isGreen && tierName && (
                <span className="tc-green-pill mt-2">
                  {tierName} • {greenRate.toFixed(2)}%
                </span>
              )}
            </div>

            {/* Sliders (for green loan and loan modes) */}
            {(isGreen || paymentMode === 'loan') && (
              <div className="space-y-6 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-bank-gray-mid">Down Payment</span>
                    <span className="font-semibold text-bank-gray-dark">
                      {downPct}% — AED {Math.round(downPayment).toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={isGreen ? 10 : 20}
                    max={50}
                    step={5}
                    value={downPct}
                    onChange={(e) => setDownPct(Number(e.target.value))}
                    className="tc-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-bank-gray-mid">Loan Term</span>
                    <span className="font-semibold text-bank-gray-dark">{termYears} years</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={isGreen ? 7 : 5}
                    step={1}
                    value={termYears}
                    onChange={(e) => setTermYears(Number(e.target.value))}
                    className="tc-slider"
                  />
                </div>
              </div>
            )}

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-bank-gray-bg text-center">
                <p className="text-sm font-bold text-bank-gray-dark">
                  AED {Math.round(emi).toLocaleString()}
                </p>
                <p className="text-xs text-bank-gray-mid">Monthly EMI</p>
              </div>
              <div className="p-3 rounded-xl bg-bank-gray-bg text-center">
                <p className="text-sm font-bold text-bank-gray-dark">
                  AED {Math.round(totalInterest).toLocaleString()}
                </p>
                <p className="text-xs text-bank-gray-mid">Total Interest</p>
              </div>
              <div className="p-3 rounded-xl bg-bank-gray-bg text-center">
                <p className="text-sm font-bold text-bank-gray-dark">
                  AED {Math.round(principal).toLocaleString()}
                </p>
                <p className="text-xs text-bank-gray-mid">Loan Amount</p>
              </div>
            </div>

            {/* Green loan benefits */}
            {isGreen && (
              <div className="p-4 rounded-xl bg-green-pale border border-green-deep/20 mb-4">
                <p className="text-xs font-semibold text-green-deep uppercase tracking-wider mb-2">
                  Green Car Loan Benefits
                </p>
                <ul className="space-y-1.5">
                  {[
                    '10% minimum down — keep more cash',
                    'Up to 7-year flexible terms',
                    'GreenDrive tier rate reductions',
                    '15% EV insurance discount',
                    '3x cashback on EV charging',
                    '30-day rate lock guarantee',
                  ].map((b, i) => (
                    <li key={i} className="text-xs text-bank-gray-dark flex items-center gap-2">
                      <span className="text-green-deep">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-bank-gray text-center">
              {isGreen
                ? 'Indicative figures only. Subject to credit approval and GreenDrive score verification.'
                : paymentMode === 'islamic'
                  ? 'Murabaha finance amount at profit rate of 0% p.a. Dubai Islamic Bank PJSC.'
                  : 'Est. monthly payment excludes taxes and fees.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

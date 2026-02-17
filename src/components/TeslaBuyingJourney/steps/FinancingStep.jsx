import { useState } from 'react';
import {
  TESLA_FINANCING,
  BANK_FINANCING,
  calculateMonthly,
  MODEL_3_VARIANTS,
} from '../../../utils/tesla-configurator-data.js';
import { TIERS, BASE_RATE } from '../../../utils/constants.js';
import GreenCallout from '../../shared/GreenCallout.jsx';
import AnimatedNumber from '../../shared/AnimatedNumber.jsx';

const MARKET_RATES = [
  { name: 'UAE Average', rate: 4.99 },
  { name: 'Major Bank A', rate: 4.75 },
  { name: 'Bank Standard', rate: BASE_RATE },
  { name: 'Tesla Finance', rate: TESLA_FINANCING.rate, isTesla: true },
];

export default function FinancingStep({ config, totalPrice, score, greenRate, tier, onApply }) {
  const [downPct, setDownPct] = useState(10);
  const [termYears, setTermYears] = useState(5);

  const variant = MODEL_3_VARIANTS.find((v) => v.id === config.variant);
  const rateReduction = score?.rateReduction || 0;

  // Calculate financing figures
  const downPayment = Math.round(totalPrice * (downPct / 100));
  const loanAmount = totalPrice - downPayment;
  const teslaDown = Math.round(totalPrice * (TESLA_FINANCING.minDownPct / 100));
  const teslaLoan = totalPrice - teslaDown;
  const bankEmi = calculateMonthly(loanAmount, greenRate, termYears);
  const teslaEmi = calculateMonthly(
    teslaLoan,
    TESLA_FINANCING.rate,
    Math.min(termYears, TESLA_FINANCING.maxTermYears),
  );
  const bankTotalInterest = bankEmi * termYears * 12 - loanAmount;
  const liquiditySaved = teslaDown - downPayment;

  // Tier progression
  const currentTierIndex = TIERS.findIndex((t) => t.name === score?.tier);
  const nextTier = currentTierIndex > 0 ? TIERS[currentTierIndex - 1] : null;

  return (
    <div className="space-y-8">
      {/* ===== Section A: Green Loan Hero Banner ===== */}
      <div className="rounded-xl bg-gradient-to-r from-green-deep to-[#0f8a5f] text-white p-6">
        <p className="text-[10px] uppercase tracking-widest text-white/60 mb-4">
          Financing Comparison
        </p>
        <div className="flex items-center justify-center gap-6 mb-5">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-3 border-white/20 bg-white/10 flex items-center justify-center mb-2">
              <span className="text-xl font-semibold">{TESLA_FINANCING.rate}%</span>
            </div>
            <p className="text-[10px] text-white/60 uppercase tracking-wider">Tesla Finance</p>
          </div>
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-3 border-white bg-white/20 flex items-center justify-center mb-2">
              <span className="text-xl font-semibold">{greenRate.toFixed(2)}%</span>
            </div>
            <p className="text-[10px] text-white/80 uppercase tracking-wider font-medium">
              Your Green Rate
            </p>
          </div>
        </div>

        {/* True cost reveal */}
        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-xs font-medium text-white/90 mb-1">True Cost Reveal</p>
          <p className="text-xs text-white/70 leading-relaxed">
            Tesla requires <strong className="text-white">20% down</strong> (AED{' '}
            {teslaDown.toLocaleString()}). With our Green Car Loan, you only need{' '}
            <strong className="text-white">10% down</strong> — keeping{' '}
            <strong className="text-white">
              AED {liquiditySaved > 0 ? liquiditySaved.toLocaleString() : '0'}
            </strong>{' '}
            more in your pocket.
          </p>
        </div>
      </div>

      {/* ===== Section B: Side-by-Side Comparison ===== */}
      <div>
        <h3 className="section-title mb-4">Side-by-Side Comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tesla column */}
          <div className="rounded-xl border border-bank-gray-alt p-5 bg-bank-gray-bg/50">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-bank-gray-alt">
              <div className="w-6 h-6 rounded-full bg-bank-gray-alt flex items-center justify-center">
                <span className="text-[10px] font-bold text-bank-gray-mid">T</span>
              </div>
              <p className="text-sm font-semibold text-bank-gray-dark">Tesla Finance</p>
            </div>
            <div className="space-y-2.5">
              <div className="text-center mb-3">
                <p className="text-2xl font-semibold text-bank-gray-dark">
                  {TESLA_FINANCING.rate}%
                </p>
                <p className="text-[10px] text-bank-gray-mid">Annual rate</p>
              </div>
              {TESLA_FINANCING.restrictions.map((r) => (
                <div key={r} className="flex items-start gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-bank-red flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-xs text-bank-gray-mid">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bank column */}
          <div className="rounded-xl border-2 border-green-main p-5 bg-green-pastel">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-pale">
              <div className="w-6 h-6 rounded-full bg-green-deep flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">B</span>
              </div>
              <p className="text-sm font-semibold text-green-deep">Green Car Loan</p>
              <span className="text-[9px] bg-green-deep text-white px-1.5 py-0.5 rounded-full font-medium ml-auto">
                Recommended
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="text-center mb-3">
                <p className="text-2xl font-semibold text-green-deep">{greenRate.toFixed(2)}%</p>
                <p className="text-[10px] text-green-deep/70">{score?.tier} rate</p>
              </div>
              {BANK_FINANCING.benefits.map((b) => (
                <div key={b} className="flex items-start gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-green-main flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-green-deep/80">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Section C: Market Rate Bar Chart ===== */}
      <div>
        <h3 className="section-title mb-4">Market Rate Comparison</h3>
        <div className="space-y-3">
          {[
            ...MARKET_RATES,
            ...(rateReduction > 0
              ? [{ name: 'Your Green Rate', rate: greenRate, isYou: true }]
              : []),
          ]
            .sort((a, b) => b.rate - a.rate)
            .map((r) => {
              const widthPct = (r.rate / 5.5) * 100;
              return (
                <div key={r.name}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span
                      className={`text-xs ${r.isYou ? 'font-semibold text-green-deep' : r.isTesla ? 'text-bank-gray-dark' : 'text-bank-gray-mid'}`}
                    >
                      {r.name}
                      {r.isYou && (
                        <span className="ml-1.5 text-[10px] bg-green-pastel text-green-deep px-1.5 py-0.5 rounded-full font-medium">
                          You
                        </span>
                      )}
                      {r.isTesla && (
                        <span className="ml-1.5 text-[10px] text-bank-gray">*conditions apply</span>
                      )}
                    </span>
                    <span
                      className={`text-sm font-semibold tabular-nums ${r.isYou ? 'text-green-deep' : 'text-bank-gray-dark'}`}
                    >
                      {r.rate.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 bg-bank-gray-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: r.isYou
                          ? 'var(--color-green-deep)'
                          : r.isTesla
                            ? 'var(--color-bank-gray-dark)'
                            : 'var(--color-bank-gray)',
                        opacity: r.isYou ? 1 : 0.6,
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>

        {liquiditySaved > 0 && (
          <div className="mt-4">
            <GreenCallout icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              <p className="text-sm font-medium text-green-deep">
                Keep AED {liquiditySaved.toLocaleString()} more upfront
              </p>
              <p className="text-xs text-green-deep/70 mt-0.5">
                Lower down payment means more cash for insurance, registration, and accessories.
              </p>
            </GreenCallout>
          </div>
        )}
      </div>

      {/* ===== Section D: Interactive EMI Calculator ===== */}
      <div>
        <h3 className="section-title mb-1">EMI Calculator</h3>
        <p className="text-xs text-bank-gray-mid mb-4">Adjust to see your personalised financing</p>

        {/* Down payment slider */}
        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-[10px] text-bank-gray-mid uppercase tracking-widest font-medium">
              Down Payment
            </label>
            <span className="text-sm font-semibold text-bank-gray-dark tabular-nums">
              {downPct}% — AED {downPayment.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={BANK_FINANCING.minDownPct}
            max={50}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="loan-slider w-full"
          />
          <div className="flex justify-between text-[10px] text-bank-gray mt-1">
            <span>{BANK_FINANCING.minDownPct}%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Term slider */}
        <div className="mb-5">
          <div className="flex justify-between items-baseline mb-1.5">
            <label className="text-[10px] text-bank-gray-mid uppercase tracking-widest font-medium">
              Loan Term
            </label>
            <span className="text-sm font-semibold text-bank-gray-dark tabular-nums">
              {termYears} years
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={BANK_FINANCING.maxTermYears}
            step={1}
            value={termYears}
            onChange={(e) => setTermYears(Number(e.target.value))}
            className="loan-slider w-full"
          />
          <div className="flex justify-between text-[10px] text-bank-gray mt-1">
            <span>2 years</span>
            <span>{BANK_FINANCING.maxTermYears} years</span>
          </div>
        </div>

        {/* EMI results */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="savings-card bg-green-pastel">
            <p className="text-[10px] text-green-deep uppercase tracking-widest mb-1.5">
              Monthly EMI
            </p>
            <p className="text-lg font-semibold text-green-deep tabular-nums">
              <AnimatedNumber value={bankEmi} decimals={0} prefix="AED " />
            </p>
          </div>
          <div className="savings-card bg-green-pastel">
            <p className="text-[10px] text-green-deep uppercase tracking-widest mb-1.5">
              Total Interest
            </p>
            <p className="text-lg font-semibold text-green-deep tabular-nums">
              <AnimatedNumber value={bankTotalInterest} decimals={0} prefix="AED " />
            </p>
          </div>
          <div className="savings-card bg-green-pale">
            <p className="text-[10px] text-green-deep uppercase tracking-widest mb-1.5">
              Loan Amount
            </p>
            <p className="text-lg font-semibold text-green-deep tabular-nums">
              AED {loanAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Comparison line items */}
        <div className="space-y-2 text-xs text-bank-gray-mid">
          <div className="flex justify-between py-1.5 border-b border-bank-gray-alt/60">
            <span>Vehicle Price</span>
            <span className="font-medium text-bank-gray-dark tabular-nums">
              AED {totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-bank-gray-alt/60">
            <span>Your Down Payment ({downPct}%)</span>
            <span className="font-medium text-green-deep tabular-nums">
              AED {downPayment.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-bank-gray-alt/60">
            <span>Tesla Required Down (20%)</span>
            <span className="font-medium text-bank-gray-dark tabular-nums">
              AED {teslaDown.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-bank-gray-alt/60">
            <span>
              Tesla EMI ({TESLA_FINANCING.rate}%,{' '}
              {Math.min(termYears, TESLA_FINANCING.maxTermYears)}yr)
            </span>
            <span className="font-medium text-bank-gray-dark tabular-nums">
              AED {Math.round(teslaEmi).toLocaleString()}/mo
            </span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="font-medium text-green-deep">
              Your Green EMI ({greenRate.toFixed(2)}%, {termYears}yr)
            </span>
            <span className="font-semibold text-green-deep tabular-nums">
              AED {Math.round(bankEmi).toLocaleString()}/mo
            </span>
          </div>
        </div>
      </div>

      {/* ===== Section E: GreenDrive Tier Preview ===== */}
      <div>
        <h3 className="section-title mb-4">Your GreenDrive Tier</h3>
        <div className="rounded-xl border border-bank-gray-alt p-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${tier?.color || '#16A34A'}20` }}
            >
              <span className="text-sm font-semibold" style={{ color: tier?.color || '#16A34A' }}>
                {score?.totalScore || 0}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: tier?.color || '#16A34A' }}>
                {score?.tier || 'Gold Green'}
              </p>
              <p className="text-[10px] text-bank-gray-mid">
                Rate reduction:{' '}
                <strong className="text-green-deep">{rateReduction.toFixed(2)}%</strong> off base
                rate
              </p>
            </div>
          </div>

          {nextTier && (
            <div className="bg-bank-gray-bg rounded-lg p-3">
              <p className="text-xs text-bank-gray-mid mb-1.5">
                Next: <strong className="text-bank-gray-dark">{nextTier.name}</strong> — unlock{' '}
                {nextTier.rateReduction.toFixed(2)}% reduction
              </p>
              <div className="h-1.5 bg-bank-gray-alt rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(5, ((score?.totalScore - (tier?.minScore || 0)) / (nextTier.minScore - (tier?.minScore || 0))) * 100)}%`,
                    backgroundColor: tier?.color || '#16A34A',
                  }}
                />
              </div>
              <p className="text-[10px] text-bank-gray mt-1">
                {nextTier.minScore - (score?.totalScore || 0)} points to {nextTier.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== Section F: Loan Summary & CTA ===== */}
      <div>
        <h3 className="section-title mb-4">Loan Summary</h3>
        <div className="rounded-xl border border-bank-gray-alt p-5 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-bank-gray-alt">
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
                Vehicle
              </p>
              <p className="text-sm font-medium text-bank-gray-dark">Model 3 {variant?.subtitle}</p>
            </div>
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
                Total Price
              </p>
              <p className="text-sm font-medium text-bank-gray-dark tabular-nums">
                AED {totalPrice.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
                Down Payment
              </p>
              <p className="text-sm font-medium text-bank-gray-dark tabular-nums">
                {downPct}% — AED {downPayment.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
                Loan Term
              </p>
              <p className="text-sm font-medium text-bank-gray-dark">{termYears} years</p>
            </div>
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
                Green Rate
              </p>
              <p className="text-sm font-semibold text-green-deep">{greenRate.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
                Monthly EMI
              </p>
              <p className="text-sm font-semibold text-green-deep tabular-nums">
                AED {Math.round(bankEmi).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-bank-gray-mid uppercase tracking-widest mb-1">
              Total Cost of Financing
            </p>
            <p className="text-xl font-semibold text-bank-gray-dark tabular-nums">
              AED {Math.round(bankEmi * termYears * 12).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Green CTA */}
        <div className="rounded-xl bg-gradient-to-r from-green-deep to-[#0f8a5f] text-white p-6">
          <div className="text-center">
            <p className="font-medium text-sm mb-1">
              You&apos;re pre-qualified for a Green Car Loan
            </p>
            <p className="text-xs text-white/70 mb-4">
              Your {score?.tier} tier unlocks a {greenRate.toFixed(2)}% rate — lower than standard
              auto financing.
            </p>
            <button
              onClick={onApply}
              className="px-8 py-3 bg-white text-green-deep rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Apply for Green Car Loan
            </button>
          </div>
        </div>

        <p className="text-[10px] text-bank-gray text-center mt-4">
          Indicative figures only. Actual rates subject to credit approval and T&amp;Cs. Tesla
          Finance rates from tesla.com/en_ae.
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';
import { BASE_RATE } from '../../utils/constants.js';

const LOAN_MIN = 100000;
const LOAN_MAX = 500000;
const LOAN_STEP = 25000;
const TERM_MIN = 2;
const TERM_MAX = 7;

export default function SavingsProjection({ rateReduction }) {
  if (!rateReduction) return null;

  const [loanAmount, setLoanAmount] = useState(250000);
  const [termYears, setTermYears] = useState(5);

  const standardMonthly = calculateMonthly(loanAmount, BASE_RATE, termYears);
  const greenMonthly = calculateMonthly(loanAmount, BASE_RATE - rateReduction, termYears);
  const monthlySaving = standardMonthly - greenMonthly;
  const annualSaving = monthlySaving * 12;
  const lifetimeSaving = monthlySaving * termYears * 12;

  const cards = [
    { label: 'Monthly', value: monthlySaving, bg: 'bg-green-pastel' },
    { label: 'Annual', value: annualSaving, bg: 'bg-green-pastel' },
    { label: 'Lifetime', value: lifetimeSaving, bg: 'bg-green-pale' },
  ];

  return (
    <Card>
      <h3 className="section-title mb-1">Your Savings Projection</h3>
      <p className="text-xs text-bank-gray-mid mb-4">Adjust loan parameters to see your personalised savings</p>

      {/* Loan Amount Slider */}
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1.5">
          <label className="text-[10px] text-bank-gray-mid uppercase tracking-widest font-medium">
            Loan Amount
          </label>
          <span className="text-sm font-semibold text-bank-gray-dark tabular-nums">
            AED {loanAmount.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min={LOAN_MIN}
          max={LOAN_MAX}
          step={LOAN_STEP}
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="loan-slider w-full"
        />
        <div className="flex justify-between text-[10px] text-bank-gray mt-1">
          <span>AED {LOAN_MIN.toLocaleString()}</span>
          <span>AED {LOAN_MAX.toLocaleString()}</span>
        </div>
      </div>

      {/* Term Slider */}
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
          min={TERM_MIN}
          max={TERM_MAX}
          step={1}
          value={termYears}
          onChange={(e) => setTermYears(Number(e.target.value))}
          className="loan-slider w-full"
        />
        <div className="flex justify-between text-[10px] text-bank-gray mt-1">
          <span>{TERM_MIN} years</span>
          <span>{TERM_MAX} years</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {cards.map((c) => (
          <div key={c.label} className={`savings-card ${c.bg}`}>
            <p className="text-[10px] text-green-deep uppercase tracking-widest mb-1.5">
              {c.label}
            </p>
            <p className="text-lg font-semibold text-green-deep">
              <AnimatedNumber value={c.value} decimals={0} prefix="AED " />
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-xs text-bank-gray-mid">
        <div className="flex justify-between py-1.5 border-b border-bank-gray-alt/60">
          <span>Standard EMI</span>
          <span className="font-medium text-bank-gray-dark tabular-nums">
            AED {Math.round(standardMonthly).toLocaleString()}/mo
          </span>
        </div>
        <div className="flex justify-between py-1.5 border-b border-bank-gray-alt/60">
          <span>Green EMI</span>
          <span className="font-medium text-green-deep tabular-nums">
            AED {Math.round(greenMonthly).toLocaleString()}/mo
          </span>
        </div>
        <div className="flex justify-between py-1.5">
          <span>Total Interest Saved</span>
          <span className="font-medium text-green-deep tabular-nums">
            AED {Math.round(lifetimeSaving).toLocaleString()}
          </span>
        </div>
      </div>

      <p className="text-[10px] text-bank-gray mt-4">
        Indicative figures only. Actual rates subject to credit approval and T&amp;Cs.
      </p>
    </Card>
  );
}

function calculateMonthly(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

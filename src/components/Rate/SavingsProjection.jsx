import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';
import { BASE_RATE } from '../../utils/constants.js';

export default function SavingsProjection({ rateReduction }) {
  if (!rateReduction) return null;

  const loanAmount = 250000;
  const termYears = 5;

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
      <p className="text-xs text-bank-gray-mid mb-5">Green Car Loan — AED 250,000 over 5 years</p>

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

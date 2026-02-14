import Card from '../shared/Card.jsx';
import AnimatedNumber from '../shared/AnimatedNumber.jsx';
import { BASE_RATE } from '../../utils/constants.js';

export default function SavingsProjection({ rateReduction }) {
  if (!rateReduction) return null;

  // Assume AED 250,000 loan over 5 years for projection
  const loanAmount = 250000;
  const termYears = 5;

  const standardMonthly = calculateMonthly(loanAmount, BASE_RATE, termYears);
  const greenMonthly = calculateMonthly(loanAmount, BASE_RATE - rateReduction, termYears);
  const monthlySaving = standardMonthly - greenMonthly;
  const annualSaving = monthlySaving * 12;
  const lifetimeSaving = monthlySaving * termYears * 12;

  return (
    <Card>
      <h3 className="text-sm font-medium text-bank-gray-dark mb-4">Savings Projection</h3>
      <p className="text-xs text-bank-gray-mid mb-4">Based on AED 250,000 loan over 5 years</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-green-pastel">
          <p className="text-xs text-green-deep mb-1">Monthly</p>
          <p className="text-lg font-medium text-green-deep">
            <AnimatedNumber value={monthlySaving} decimals={0} prefix="AED " />
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-green-pastel">
          <p className="text-xs text-green-deep mb-1">Annual</p>
          <p className="text-lg font-medium text-green-deep">
            <AnimatedNumber value={annualSaving} decimals={0} prefix="AED " />
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-green-pale">
          <p className="text-xs text-green-deep mb-1">Lifetime</p>
          <p className="text-lg font-medium text-green-deep">
            <AnimatedNumber value={lifetimeSaving} decimals={0} prefix="AED " />
          </p>
        </div>
      </div>
    </Card>
  );
}

function calculateMonthly(principal, annualRate, years) {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
}

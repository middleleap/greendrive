import Card from '../shared/Card.jsx';
import { BASE_RATE } from '../../utils/constants.js';

const COMPETITORS = [
  { name: 'Average UAE Auto Loan', rate: 4.99, color: '#A5A5A5' },
  { name: 'Major Bank A', rate: 4.75, color: '#B0B0B0' },
  { name: 'Major Bank B', rate: 4.49, color: '#C0C0C0' },
  { name: 'Bank Standard Rate', rate: BASE_RATE, color: '#BE000E' },
];

export default function CompetitiveRates({ rateReduction }) {
  const greenRate = BASE_RATE - (rateReduction || 0);
  const maxRate = 5.5;

  const allRates = [
    ...COMPETITORS,
    ...(rateReduction > 0
      ? [{ name: 'Your Green Rate', rate: greenRate, color: '#0A6847', isYou: true }]
      : []),
  ].sort((a, b) => b.rate - a.rate);

  return (
    <Card>
      <h3 className="section-title mb-1">Market Rate Comparison</h3>
      <p className="text-xs text-bank-gray-mid mb-5">
        See how your GreenDrive rate compares to UAE auto financing
      </p>

      <div className="space-y-3">
        {allRates.map((r) => {
          const widthPct = (r.rate / maxRate) * 100;
          return (
            <div key={r.name}>
              <div className="flex justify-between items-baseline mb-1">
                <span
                  className={`text-xs ${r.isYou ? 'font-semibold text-green-deep' : 'text-bank-gray-mid'}`}
                >
                  {r.name}
                  {r.isYou && (
                    <span className="ml-1.5 text-[10px] bg-green-pastel text-green-deep px-1.5 py-0.5 rounded-full font-medium">
                      You
                    </span>
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
                    backgroundColor: r.color,
                    opacity: r.isYou ? 1 : 0.6,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {rateReduction > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-green-pastel">
          <p className="text-xs text-green-deep">
            Your GreenDrive rate is <strong>{(COMPETITORS[0].rate - greenRate).toFixed(2)}%</strong>{' '}
            lower than the UAE market average — saving you thousands over the loan term.
          </p>
        </div>
      )}
    </Card>
  );
}

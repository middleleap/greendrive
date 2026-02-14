import Card from '../shared/Card.jsx';
import { TIERS, BASE_RATE } from '../../utils/constants.js';

export default function TierTable({ currentTier }) {
  return (
    <Card padding={false}>
      <div className="p-6 pb-3">
        <h3 className="text-sm font-medium text-bank-gray-dark">GreenDrive Tiers</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-bank-gray-mid uppercase tracking-wider">
            <th className="text-left px-6 py-2 font-medium">Tier</th>
            <th className="text-center px-4 py-2 font-medium">Score Range</th>
            <th className="text-center px-4 py-2 font-medium">Reduction</th>
            <th className="text-right px-6 py-2 font-medium">Green Rate</th>
          </tr>
        </thead>
        <tbody>
          {TIERS.map((tier, i) => {
            const isActive = tier.name === currentTier;
            return (
              <tr
                key={tier.name}
                className={`border-t border-bank-gray-alt ${
                  isActive ? 'bg-green-pastel' : i % 2 === 0 ? 'bg-bank-gray-bg' : 'bg-white'
                }`}
              >
                <td className="px-6 py-3">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span
                      className={`font-medium ${isActive ? 'text-green-deep' : 'text-bank-gray-dark'}`}
                    >
                      {tier.name}
                    </span>
                    {isActive && (
                      <span className="text-xs bg-green-deep text-white px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </span>
                </td>
                <td className="text-center px-4 py-3 text-bank-gray-mid">
                  {tier.minScore}–{tier.maxScore}
                </td>
                <td className="text-center px-4 py-3 text-bank-gray-mid">
                  {tier.rateReduction.toFixed(2)}%
                </td>
                <td className="text-right px-6 py-3 font-medium text-bank-gray-dark">
                  {(BASE_RATE - tier.rateReduction).toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

import Card from '../shared/Card.jsx';
import { TIERS, BASE_RATE } from '../../utils/constants.js';

export default function TierTable({ currentTier }) {
  return (
    <Card padding={false}>
      <div className="p-6 pb-3">
        <h3 className="section-title">GreenDrive Tiers</h3>
      </div>

      {/* Desktop: table layout */}
      <table className="w-full text-sm hidden md:table">
        <thead>
          <tr className="text-[10px] text-bank-gray-mid uppercase tracking-widest">
            <th className="text-left px-6 py-2.5 font-medium">Tier</th>
            <th className="text-center px-4 py-2.5 font-medium">Score Range</th>
            <th className="text-center px-4 py-2.5 font-medium">Reduction</th>
            <th className="text-right px-6 py-2.5 font-medium">Green Rate</th>
          </tr>
        </thead>
        <tbody>
          {TIERS.map((tier) => {
            const isActive = tier.name === currentTier;
            return (
              <tr
                key={tier.name}
                className={`tier-row border-t border-bank-gray-alt/60 ${isActive ? 'active bg-green-pastel' : ''}`}
              >
                <td className="px-6 py-3.5">
                  <span className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: tier.color,
                        boxShadow: isActive ? `0 0 6px ${tier.color}60` : 'none',
                      }}
                    />
                    <span
                      className={`font-medium ${isActive ? 'text-green-deep' : 'text-bank-gray-dark'}`}
                    >
                      {tier.name}
                    </span>
                    {isActive && (
                      <span className="text-[10px] bg-green-deep text-white px-2 py-0.5 rounded-full font-medium tracking-wide">
                        You
                      </span>
                    )}
                  </span>
                </td>
                <td className="text-center px-4 py-3.5 text-bank-gray-mid tabular-nums">
                  {tier.minScore}&ndash;{tier.maxScore}
                </td>
                <td className="text-center px-4 py-3.5 text-bank-gray-mid tabular-nums">
                  {tier.rateReduction.toFixed(2)}%
                </td>
                <td className="text-right px-6 py-3.5 font-medium text-bank-gray-dark tabular-nums">
                  {(BASE_RATE - tier.rateReduction).toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile: card layout */}
      <div className="md:hidden px-4 pb-4 space-y-2">
        {TIERS.map((tier) => {
          const isActive = tier.name === currentTier;
          return (
            <div
              key={tier.name}
              className={`rounded-xl p-3.5 border transition-colors ${
                isActive
                  ? 'bg-green-pastel border-green-deep/20'
                  : 'bg-bank-gray-bg/50 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: tier.color,
                      boxShadow: isActive ? `0 0 6px ${tier.color}60` : 'none',
                    }}
                  />
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-green-deep' : 'text-bank-gray-dark'}`}
                  >
                    {tier.name}
                  </span>
                  {isActive && (
                    <span className="text-[10px] bg-green-deep text-white px-2 py-0.5 rounded-full font-medium tracking-wide">
                      You
                    </span>
                  )}
                </span>
                <span
                  className={`text-sm font-semibold tabular-nums ${isActive ? 'text-green-deep' : 'text-bank-gray-dark'}`}
                >
                  {(BASE_RATE - tier.rateReduction).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-bank-gray-mid">
                <span>
                  Score: {tier.minScore}&ndash;{tier.maxScore}
                </span>
                <span>&middot;</span>
                <span>-{tier.rateReduction.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

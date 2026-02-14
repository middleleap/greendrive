export const TIERS = [
  { name: 'Platinum Green', minScore: 85, maxScore: 100, rateReduction: 0.50, color: '#0A6847' },
  { name: 'Gold Green',     minScore: 70, maxScore: 84,  rateReduction: 0.40, color: '#16A34A' },
  { name: 'Silver Green',   minScore: 55, maxScore: 69,  rateReduction: 0.25, color: '#22C55E' },
  { name: 'Bronze Green',   minScore: 40, maxScore: 54,  rateReduction: 0.10, color: '#F26B43' },
  { name: 'Standard',       minScore: 0,  maxScore: 39,  rateReduction: 0.00, color: '#A5A5A5' },
];

export function getTier(score) {
  return TIERS.find(t => score >= t.minScore && score <= t.maxScore) || TIERS[TIERS.length - 1];
}
